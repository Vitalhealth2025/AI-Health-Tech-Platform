import { NextRequest, NextResponse } from 'next/server';
import { sanitizeForPrompt } from '@/lib/validation';

function computeFallbackScore(
  totalCalories: number,
  calorieGoal: number,
  mealsLogged: number
): { healthScore: number; recommendations: string[] } {
  if (mealsLogged === 0) {
    return {
      healthScore: 0,
      recommendations: [
        'Start logging your meals to get a personalized health score.',
        'Tracking what you eat is the first step toward reaching your health goals.',
        'Log your breakfast, lunch, and dinner to see your daily progress.',
      ],
    };
  }

  const ratio = totalCalories / calorieGoal;
  let healthScore: number;
  if (ratio >= 0.85 && ratio <= 1.05) healthScore = 82;
  else if (ratio >= 0.7 && ratio < 0.85) healthScore = 68;
  else if (ratio > 1.05 && ratio <= 1.2) healthScore = 65;
  else if (ratio < 0.5) healthScore = 45;
  else if (ratio > 1.3) healthScore = 48;
  else healthScore = 58;

  const remaining = calorieGoal - totalCalories;
  const recommendations: string[] = [];

  if (remaining > 500) {
    recommendations.push(
      `You have ${remaining} calories left today — try adding a balanced meal to hit your goal.`
    );
  } else if (remaining > 0) {
    recommendations.push(`Almost there! Only ${remaining} calories to your daily goal.`);
  } else {
    recommendations.push(
      `You've exceeded your goal by ${Math.abs(remaining)} cal — keep it light for the rest of the day.`
    );
  }

  recommendations.push(
    `${mealsLogged} meal${mealsLogged !== 1 ? 's' : ''} logged today — great job staying consistent.`
  );
  recommendations.push(
    'Stay hydrated. Aim for at least 8 glasses of water throughout the day.'
  );

  return { healthScore, recommendations };
}

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    const calorieGoal = Math.max(0, Number(userData.calorieGoal) || 2000);
    const totalCalories = Math.max(0, Number(userData.totalCalories) || 0);
    const remaining = calorieGoal - totalCalories;
    const mealsLogged = Array.isArray(userData.meals) ? userData.meals.length : 0;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(computeFallbackScore(totalCalories, calorieGoal, mealsLogged));
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const safeName = sanitizeForPrompt(userData.firstName);
    const safeActivityLevel = sanitizeForPrompt(userData.activityLevel || 'not specified');
    const safeHealthGoal = sanitizeForPrompt(userData.healthGoal || 'not specified');

    const safeMeals =
      mealsLogged > 0
        ? (userData.meals as Array<{ foodName?: string; calories?: number; mealType?: string }>)
            .slice(0, 20)
            .map((m) => ({
              foodName: sanitizeForPrompt(m.foodName ?? ''),
              calories: Math.max(0, Number(m.calories) || 0),
              mealType: sanitizeForPrompt(m.mealType ?? ''),
            }))
        : null;

    const prompt = `You are a health coach AI. Given the following user data, provide a health score and personalized recommendations.

User data:
- Name: ${safeName}
- Calorie goal: ${calorieGoal} cal
- Calories consumed today: ${totalCalories} cal
- Calories remaining: ${remaining} cal
- Meals logged today: ${mealsLogged} meal(s)
- Activity level: ${safeActivityLevel}
- Health goal: ${safeHealthGoal}
- Meal details: ${safeMeals ? JSON.stringify(safeMeals, null, 2) : 'none yet'}

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "healthScore": <integer 0-100>,
  "recommendations": [<string>, <string>, <string>]
}

Score guidelines: 70-100 = on track, 40-69 = needs improvement, 0-39 = significant issues.
If no meals are logged, score should be 0 and recommendations should encourage logging meals.

For recommendations, be specific and motivational using the actual calorie numbers. No emojis. Examples of the tone:
- "You're ${Math.abs(remaining)} calories away from your goal."
- "You're nearly at your calorie target — great work."
- "Only ${mealsLogged} meal(s) logged so far — keep tracking to hit your goal."
Always include the actual numbers (calories remaining, meals logged, etc.) in the recommendations.
Provide exactly 3 short, friendly, and actionable recommendations.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') throw new Error('No text in response');

    const rawText = textBlock.text.replace(/```json\n?|\n?```/g, '').trim();
    const aiData = JSON.parse(rawText);
    return NextResponse.json(aiData);
  } catch (err) {
    console.error('Health score error:', err);
    return NextResponse.json({ healthScore: null, recommendations: [] }, { status: 500 });
  }
}
