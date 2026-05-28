import { NextRequest, NextResponse } from 'next/server';
import { sanitizeForPrompt } from '@/lib/validation';

interface Suggestion {
  name: string;
  calories: number;
  instructions: string;
}

const FALLBACK: Record<string, Suggestion[]> = {
  Breakfast: [
    {
      name: 'Scrambled Eggs on Toast',
      calories: 380,
      instructions:
        'Whisk 2 eggs with salt and pepper. Cook in a buttered pan over medium heat, stirring gently. Serve on toasted whole grain bread.',
    },
    {
      name: 'Peanut Butter Banana Oatmeal',
      calories: 420,
      instructions:
        'Cook 1/2 cup oats with 1 cup water or milk for 5 minutes. Top with a sliced banana, 1 tbsp peanut butter, and a sprinkle of cinnamon.',
    },
    {
      name: 'Greek Yogurt Parfait',
      calories: 290,
      instructions:
        'Layer 1 cup Greek yogurt with 1/4 cup granola and a handful of fresh berries. Drizzle with honey and serve immediately.',
    },
  ],
  Lunch: [
    {
      name: 'Grilled Chicken Salad',
      calories: 450,
      instructions:
        'Season chicken breast with salt, pepper, and garlic powder. Grill 6-7 min per side. Slice and serve over mixed greens with olive oil and lemon dressing.',
    },
    {
      name: 'Tuna Wrap',
      calories: 380,
      instructions:
        'Mix canned tuna with 1 tbsp mayo, diced celery, and a squeeze of lemon. Spread on a whole wheat tortilla with lettuce and tomato, then roll and slice.',
    },
    {
      name: 'Veggie Rice Bowl',
      calories: 410,
      instructions:
        'Cook 1 cup rice. Sauté bell peppers, zucchini, and onion in olive oil with cumin and paprika. Serve veggies over rice with a squeeze of lime.',
    },
  ],
  Dinner: [
    {
      name: 'Baked Lemon Herb Chicken',
      calories: 520,
      instructions:
        'Rub chicken thighs with olive oil, lemon zest, minced garlic, and mixed herbs. Bake at 200°C (400°F) for 35-40 minutes until golden and cooked through.',
    },
    {
      name: 'Egg Fried Rice',
      calories: 480,
      instructions:
        'Fry cold cooked rice in a hot oiled pan. Push aside, scramble 2 eggs, then mix together. Add soy sauce, garlic, and any vegetables you have. Cook 5 more minutes.',
    },
    {
      name: 'Lentil and Vegetable Soup',
      calories: 390,
      instructions:
        'Sauté onion, carrot, and celery in olive oil. Add 1 cup red lentils, 4 cups broth, cumin, and coriander. Simmer 20-25 minutes until lentils are tender.',
    },
  ],
  Snack: [
    {
      name: 'Apple with Peanut Butter',
      calories: 210,
      instructions:
        'Slice 1 medium apple into wedges and serve alongside 2 tbsp peanut butter for dipping. A great balance of carbs, protein, and healthy fats.',
    },
    {
      name: 'Hummus and Veggie Sticks',
      calories: 180,
      instructions:
        'Cut carrots, celery, and cucumber into sticks. Serve with 3-4 tbsp hummus for dipping. Quick to prep and very filling.',
    },
    {
      name: 'Trail Mix',
      calories: 240,
      instructions:
        'Combine 2 tbsp each of almonds, walnuts, dried cranberries, and a few dark chocolate chips. Mix and enjoy as a portable energy-boosting snack.',
    },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { ingredients, mealType } = await req.json();

    const safeIngredients = sanitizeForPrompt(ingredients || '');
    const safeMealType = sanitizeForPrompt(mealType || 'Lunch');

    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    if (!hasOpenAI && !hasAnthropic) {
      const fallback = FALLBACK[safeMealType] || FALLBACK.Lunch;
      return NextResponse.json({ suggestions: fallback });
    }

    const prompt = `You are a nutrition expert and chef. The user has these ingredients available and wants a ${safeMealType} idea.

Available ingredients: ${safeIngredients}

Generate exactly 3 healthy ${safeMealType} options using primarily these ingredients (common pantry staples like salt, oil, and water are always assumed available).

Respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "suggestions": [
    {
      "name": "Meal Name",
      "calories": 400,
      "instructions": "Brief 2-3 sentence preparation steps."
    },
    {
      "name": "Meal Name",
      "calories": 350,
      "instructions": "Brief 2-3 sentence preparation steps."
    },
    {
      "name": "Meal Name",
      "calories": 300,
      "instructions": "Brief 2-3 sentence preparation steps."
    }
  ]
}

Calorie counts should be realistic estimates for a standard single serving. Keep instructions concise and actionable.`;

    let rawText: string;

    if (hasOpenAI) {
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      rawText = (response.choices[0].message.content ?? '').replace(/```json\n?|\n?```/g, '').trim();
    } else {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') throw new Error('No text in response');
      rawText = textBlock.text.replace(/```json\n?|\n?```/g, '').trim();
    }

    const data = JSON.parse(rawText);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Meal suggestions error:', err);
    const fallback = FALLBACK['Lunch'];
    return NextResponse.json({ suggestions: fallback });
  }
}
