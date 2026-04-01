import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeForPrompt } from '@/lib/validation';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    const calorieGoal = Math.max(0, Number(userData.calorieGoal) || 2000);
    const totalCalories = Math.max(0, Number(userData.totalCalories) || 0);
    const remaining = calorieGoal - totalCalories;
    const mealsLogged = Array.isArray(userData.meals) ? userData.meals.length : 0;

    const safeName = sanitizeForPrompt(userData.firstName);
    const safeActivityLevel = sanitizeForPrompt(userData.activityLevel || 'not specified');
    const safeHealthGoal = sanitizeForPrompt(userData.healthGoal || 'not specified');

    // Sanitize meal names before including in prompt
    const safeMeals = mealsLogged > 0
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

For recommendations, be specific and motivational using the actual calorie numbers. Examples of the tone:
- "You're ${Math.abs(remaining)} calories away from your goal 📊"
- "You're nearly at your calorie target — great job! 💪"
- "Only ${mealsLogged} meal(s) logged so far — keep tracking to hit your goal!"
Always include the actual numbers (calories remaining, meals logged, etc.) in the recommendations.
Provide exactly 3 short, friendly, and actionable recommendations.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text in response');
    }

    // Strip markdown code fences if model wraps response
    const rawText = textBlock.text.replace(/```json\n?|\n?```/g, '').trim();
    const aiData = JSON.parse(rawText);
    return NextResponse.json(aiData);
  } catch (err) {
    console.error('Health score error:', err);
    return NextResponse.json(
      { healthScore: null, recommendations: [] },
      { status: 500 }
    );
  }
}
