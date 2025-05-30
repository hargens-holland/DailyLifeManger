/**
=========================================================
* AI Recipe Generation Service
=========================================================
*/

class RecipeAIService {
    constructor() {
        this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        this.isAvailable = this.apiKey && this.apiKey !== 'your_openai_api_key_here';
    }

    // Check if AI service is available
    isServiceAvailable() {
        return this.isAvailable;
    }

    // Generate recipe suggestions based on available ingredients
    async generateRecipeSuggestions(ingredients, dietaryRestrictions = [], mealType = 'any') {
        if (!this.isAvailable) {
            // Return dynamic mock suggestions for development
            return this.getDynamicMockRecipeSuggestions(ingredients, dietaryRestrictions, mealType);
        }

        try {
            const prompt = this.buildPrompt(ingredients, dietaryRestrictions, mealType);

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful cooking assistant that suggests recipes based on available ingredients. Always respond with valid JSON format.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            try {
                return JSON.parse(content);
            } catch (parseError) {
                console.error('Failed to parse AI response:', content);
                return this.getDynamicMockRecipeSuggestions(ingredients, dietaryRestrictions, mealType);
            }
        } catch (error) {
            console.error('Error generating recipe suggestions:', error);
            return this.getDynamicMockRecipeSuggestions(ingredients, dietaryRestrictions, mealType);
        }
    }

    buildPrompt(ingredients, dietaryRestrictions, mealType) {
        const restrictionsText = dietaryRestrictions.length > 0
            ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}. `
            : '';

        const mealTypeText = mealType !== 'any' ? `Meal type: ${mealType}. ` : '';

        return `Based on these available ingredients: ${ingredients.join(', ')}, suggest 3 recipes. ${restrictionsText}${mealTypeText}

Please respond with a JSON object in this exact format:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "cookingTime": "30 minutes",
      "difficulty": "Easy",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "servings": 4,
      "usedIngredients": ["ingredients from pantry that are used"],
      "additionalIngredients": ["ingredients needed but not in pantry"]
    }
  ]
}`;
    }

    // Dynamic mock suggestions based on actual ingredients
    getDynamicMockRecipeSuggestions(ingredients, dietaryRestrictions, mealType) {
        console.log('Generating dynamic mock recipes for ingredients:', ingredients);

        const recipes = [];
        const usedIngredients = ingredients.slice(0, Math.min(ingredients.length, 4));

        // Recipe 1: Based on primary ingredients
        if (this.hasVegetables(ingredients)) {
            recipes.push(this.generateVegetableRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions));
        } else if (this.hasMeat(ingredients)) {
            recipes.push(this.generateMeatRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions));
        } else if (this.hasGrains(ingredients)) {
            recipes.push(this.generateGrainRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions));
        } else {
            recipes.push(this.generateGenericRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions));
        }

        // Recipe 2: Different style based on meal type
        if (mealType === 'breakfast') {
            recipes.push(this.generateBreakfastRecipe(ingredients, usedIngredients, dietaryRestrictions));
        } else if (mealType === 'dessert') {
            recipes.push(this.generateDessertRecipe(ingredients, usedIngredients, dietaryRestrictions));
        } else {
            recipes.push(this.generateQuickRecipe(ingredients, usedIngredients, dietaryRestrictions));
        }

        // Recipe 3: Fusion or creative recipe
        recipes.push(this.generateCreativeRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions));

        return { recipes: recipes.slice(0, 3) };
    }

    // Helper methods to detect ingredient types
    hasVegetables(ingredients) {
        const vegetables = ['tomato', 'onion', 'carrot', 'potato', 'bell pepper', 'broccoli', 'spinach', 'lettuce', 'cucumber', 'zucchini', 'mushroom', 'garlic', 'celery'];
        return ingredients.some(ing => vegetables.some(veg => ing.toLowerCase().includes(veg)));
    }

    hasMeat(ingredients) {
        const meats = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey', 'bacon', 'ham', 'sausage'];
        return ingredients.some(ing => meats.some(meat => ing.toLowerCase().includes(meat)));
    }

    hasGrains(ingredients) {
        const grains = ['rice', 'pasta', 'bread', 'quinoa', 'oats', 'flour', 'noodles'];
        return ingredients.some(ing => grains.some(grain => ing.toLowerCase().includes(grain)));
    }

    hasDairy(ingredients) {
        const dairy = ['milk', 'cheese', 'butter', 'yogurt', 'cream'];
        return ingredients.some(ing => dairy.some(d => ing.toLowerCase().includes(d)));
    }

    // Recipe generators based on ingredient types
    generateVegetableRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions) {
        const vegIngredients = ingredients.filter(ing =>
            ['tomato', 'onion', 'carrot', 'potato', 'bell pepper', 'broccoli', 'spinach', 'zucchini', 'mushroom'].some(veg =>
                ing.toLowerCase().includes(veg)
            )
        );

        return {
            name: `Fresh ${vegIngredients[0] || 'Vegetable'} Stir Fry`,
            description: `A healthy and colorful stir fry featuring ${usedIngredients.join(', ')}`,
            cookingTime: "20 minutes",
            difficulty: "Easy",
            ingredients: [...usedIngredients, "olive oil", "soy sauce", "garlic", "ginger"],
            instructions: [
                `Wash and chop ${usedIngredients.join(', ')}`,
                "Heat olive oil in a large pan or wok",
                "Add garlic and ginger, stir for 30 seconds",
                "Add vegetables starting with harder ones first",
                "Stir fry for 8-10 minutes until tender-crisp",
                "Season with soy sauce and serve hot"
            ],
            servings: 3,
            usedIngredients: usedIngredients,
            additionalIngredients: ["olive oil", "soy sauce", "garlic", "ginger"]
        };
    }

    generateMeatRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions) {
        const meatIngredients = ingredients.filter(ing =>
            ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey'].some(meat =>
                ing.toLowerCase().includes(meat)
            )
        );

        const mainMeat = meatIngredients[0] || 'chicken';

        return {
            name: `Savory ${mainMeat.charAt(0).toUpperCase() + mainMeat.slice(1)} Skillet`,
            description: `A protein-rich dish featuring ${mainMeat} with ${usedIngredients.filter(ing => ing !== mainMeat).join(', ')}`,
            cookingTime: "35 minutes",
            difficulty: "Medium",
            ingredients: [...usedIngredients, "olive oil", "salt", "pepper", "herbs"],
            instructions: [
                `Season ${mainMeat} with salt and pepper`,
                "Heat olive oil in a large skillet over medium-high heat",
                `Cook ${mainMeat} until golden brown and cooked through`,
                "Remove meat and set aside",
                "Add remaining ingredients to the same pan",
                "Cook until tender, then return meat to pan",
                "Simmer together for 5 minutes and serve"
            ],
            servings: 4,
            usedIngredients: usedIngredients,
            additionalIngredients: ["olive oil", "salt", "pepper", "herbs"]
        };
    }

    generateGrainRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions) {
        const grainIngredients = ingredients.filter(ing =>
            ['rice', 'pasta', 'quinoa', 'oats'].some(grain =>
                ing.toLowerCase().includes(grain)
            )
        );

        const mainGrain = grainIngredients[0] || 'rice';

        return {
            name: `${mainGrain.charAt(0).toUpperCase() + mainGrain.slice(1)} Bowl`,
            description: `A hearty bowl featuring ${mainGrain} with ${usedIngredients.filter(ing => ing !== mainGrain).join(', ')}`,
            cookingTime: "25 minutes",
            difficulty: "Easy",
            ingredients: [...usedIngredients, "vegetable broth", "olive oil", "seasonings"],
            instructions: [
                `Cook ${mainGrain} according to package directions using vegetable broth`,
                "While grain cooks, prepare other ingredients",
                "Heat olive oil in a pan",
                "Sauté remaining ingredients until tender",
                "Combine cooked grain with sautéed ingredients",
                "Season to taste and serve warm"
            ],
            servings: 3,
            usedIngredients: usedIngredients,
            additionalIngredients: ["vegetable broth", "olive oil", "seasonings"]
        };
    }

    generateBreakfastRecipe(ingredients, usedIngredients, dietaryRestrictions) {
        return {
            name: `Morning ${usedIngredients[0] || 'Ingredient'} Scramble`,
            description: `A nutritious breakfast featuring ${usedIngredients.join(', ')}`,
            cookingTime: "15 minutes",
            difficulty: "Easy",
            ingredients: [...usedIngredients, "eggs", "butter", "salt", "pepper"],
            instructions: [
                "Prepare and chop all ingredients",
                "Heat butter in a non-stick pan",
                "Add ingredients and cook until tender",
                "Beat eggs and pour into the pan",
                "Scramble everything together until eggs are set",
                "Season with salt and pepper, serve hot"
            ],
            servings: 2,
            usedIngredients: usedIngredients,
            additionalIngredients: ["eggs", "butter", "salt", "pepper"]
        };
    }

    generateDessertRecipe(ingredients, usedIngredients, dietaryRestrictions) {
        return {
            name: `Sweet ${usedIngredients[0] || 'Fruit'} Delight`,
            description: `A simple dessert showcasing ${usedIngredients.join(', ')}`,
            cookingTime: "20 minutes",
            difficulty: "Easy",
            ingredients: [...usedIngredients, "sugar", "vanilla", "cream"],
            instructions: [
                "Prepare main ingredients by washing and chopping",
                "Combine with sugar in a saucepan",
                "Cook over medium heat until tender",
                "Add vanilla and stir",
                "Serve warm or chilled with cream",
                "Garnish as desired"
            ],
            servings: 4,
            usedIngredients: usedIngredients,
            additionalIngredients: ["sugar", "vanilla", "cream"]
        };
    }

    generateQuickRecipe(ingredients, usedIngredients, dietaryRestrictions) {
        return {
            name: `Quick ${usedIngredients[0] || 'Ingredient'} Sauté`,
            description: `A fast and easy dish with ${usedIngredients.join(', ')}`,
            cookingTime: "12 minutes",
            difficulty: "Very Easy",
            ingredients: [...usedIngredients, "olive oil", "garlic", "lemon"],
            instructions: [
                "Heat olive oil in a large pan",
                "Add garlic and cook for 30 seconds",
                "Add main ingredients and sauté quickly",
                "Cook until just tender",
                "Finish with lemon juice",
                "Serve immediately while hot"
            ],
            servings: 2,
            usedIngredients: usedIngredients,
            additionalIngredients: ["olive oil", "garlic", "lemon"]
        };
    }

    generateCreativeRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions) {
        const creativeName = this.generateCreativeName(usedIngredients);

        return {
            name: creativeName,
            description: `A creative fusion dish combining ${usedIngredients.join(', ')} in an unexpected way`,
            cookingTime: "30 minutes",
            difficulty: "Medium",
            ingredients: [...usedIngredients, "coconut oil", "spices", "fresh herbs"],
            instructions: [
                "Prepare all ingredients with creative cuts and preparations",
                "Heat coconut oil in a large pan",
                "Layer ingredients based on cooking times",
                "Add spices and herbs for complex flavors",
                "Cook until everything is perfectly tender",
                "Plate creatively and serve with pride"
            ],
            servings: 3,
            usedIngredients: usedIngredients,
            additionalIngredients: ["coconut oil", "spices", "fresh herbs"]
        };
    }

    generateGenericRecipe(ingredients, usedIngredients, mealType, dietaryRestrictions) {
        return {
            name: `Simple ${usedIngredients.join(' & ')} Medley`,
            description: `A straightforward dish highlighting ${usedIngredients.join(', ')}`,
            cookingTime: "25 minutes",
            difficulty: "Easy",
            ingredients: [...usedIngredients, "oil", "salt", "pepper"],
            instructions: [
                "Prepare all ingredients by cleaning and chopping",
                "Heat oil in a suitable cooking vessel",
                "Add ingredients in order of cooking time needed",
                "Cook until all ingredients are tender",
                "Season with salt and pepper to taste",
                "Serve hot and enjoy"
            ],
            servings: 3,
            usedIngredients: usedIngredients,
            additionalIngredients: ["oil", "salt", "pepper"]
        };
    }

    generateCreativeName(ingredients) {
        const adjectives = ["Fusion", "Harmony", "Medley", "Symphony", "Blend", "Surprise"];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const mainIngredient = ingredients[0] || "Garden";

        return `${randomAdjective} ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Creation`;
    }

    // Generate detailed recipe from a recipe suggestion
    async generateDetailedRecipe(recipeName, ingredients) {
        if (!this.isAvailable) {
            return this.getMockDetailedRecipe(recipeName, ingredients);
        }

        try {
            const prompt = `Create a detailed recipe for "${recipeName}" using these ingredients: ${ingredients.join(', ')}. 

Please respond with a JSON object in this exact format:
{
  "name": "${recipeName}",
  "description": "Detailed description",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "totalTime": "45 minutes",
  "difficulty": "Medium",
  "servings": 4,
  "ingredients": [
    {"item": "ingredient name", "amount": "1 cup", "notes": "optional notes"}
  ],
  "instructions": [
    {"step": 1, "instruction": "Detailed step 1", "time": "5 minutes"},
    {"step": 2, "instruction": "Detailed step 2", "time": "10 minutes"}
  ],
  "tips": ["Helpful tip 1", "Helpful tip 2"],
  "nutrition": {
    "calories": 350,
    "protein": "15g",
    "carbs": "45g",
    "fat": "12g"
  }
}`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional chef that creates detailed, easy-to-follow recipes. Always respond with valid JSON format.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 2000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            try {
                return JSON.parse(content);
            } catch (parseError) {
                console.error('Failed to parse AI response:', content);
                return this.getMockDetailedRecipe(recipeName, ingredients);
            }
        } catch (error) {
            console.error('Error generating detailed recipe:', error);
            return this.getMockDetailedRecipe(recipeName, ingredients);
        }
    }

    getMockDetailedRecipe(recipeName, ingredients = []) {
        return {
            name: recipeName,
            description: `A delicious recipe featuring ${ingredients.slice(0, 3).join(', ')} and other complementary ingredients`,
            prepTime: "15 minutes",
            cookTime: "30 minutes",
            totalTime: "45 minutes",
            difficulty: "Medium",
            servings: 4,
            ingredients: [
                ...ingredients.slice(0, 4).map(ing => ({
                    item: ing,
                    amount: "1 cup",
                    notes: "fresh if available"
                })),
                { item: "Olive oil", amount: "2 tbsp", notes: "extra virgin" },
                { item: "Salt", amount: "1 tsp", notes: "to taste" },
                { item: "Black pepper", amount: "1/2 tsp", notes: "freshly ground" }
            ],
            instructions: [
                { step: 1, instruction: "Prepare all ingredients by washing, peeling, and chopping as needed", time: "10 minutes" },
                { step: 2, instruction: "Heat olive oil in a large pan over medium heat", time: "2 minutes" },
                { step: 3, instruction: `Add ${ingredients[0] || 'main ingredient'} and cook until starting to soften`, time: "8 minutes" },
                { step: 4, instruction: "Add remaining ingredients and seasonings", time: "5 minutes" },
                { step: 5, instruction: "Continue cooking until everything is tender and flavors are well combined", time: "15 minutes" },
                { step: 6, instruction: "Taste and adjust seasoning as needed, then serve hot", time: "3 minutes" }
            ],
            tips: [
                `Make sure ${ingredients[0] || 'ingredients'} are fresh for the best flavor`,
                "Don't overcook the vegetables to maintain their texture and nutrients",
                "This recipe can be made ahead and reheated gently",
                "Feel free to adjust spices according to your taste preferences"
            ],
            nutrition: {
                calories: 285,
                protein: "12g",
                carbs: "35g",
                fat: "8g"
            }
        };
    }
}

export default new RecipeAIService(); 