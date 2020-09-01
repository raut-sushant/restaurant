import { Recipe } from './recipe.model'; 
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { InjectableCompiler } from '@angular/compiler/src/injectable_compiler';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService { 
    recipeSelected = new EventEmitter<Recipe>();
    private recipes: Recipe[] = [
        new Recipe('Chicken Tikka', 
                   'Chicken Tikka Masala', 
                   'https://www.closetcooking.com/wp-content/uploads/2019/11/Chicken-Tikka-Masala-1200-8412.jpg',
                   [new Ingredient('Masala', 1),
                   new Ingredient('Special Masala', 2)
                ]),
        new Recipe('Chicken Biryani', 
                   'Authentic Chicken Biryani', 
                   'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ0r19KTL77WFPRpEnLSN71pgeYl8jaleep2Q&usqp=CAU',
                   [new Ingredient('Rice', 1),
                   new Ingredient('Special Biryani Masala', 2)])
      ];
      
      constructor(private slService: ShoppingListService){

      }

      getRecipes(){
        return this.recipes.slice();
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
      }
}