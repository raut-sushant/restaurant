import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model'; 
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Injectable()
export class RecipeService { 
    
  recipesChanged = new Subject<Recipe[]>();
    // private recipes: Recipe[] = [
    //     new Recipe('Chicken Tikka', 
    //                'Chicken Tikka Masala', 
    //                'https://www.closetcooking.com/wp-content/uploads/2019/11/Chicken-Tikka-Masala-1200-8412.jpg',
    //                [new Ingredient('Masala', 1),
    //                new Ingredient('Special Masala', 2)
    //             ]),
    //     new Recipe('Chicken Biryani', 
    //                'Authentic Chicken Biryani', 
    //                'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ0r19KTL77WFPRpEnLSN71pgeYl8jaleep2Q&usqp=CAU',
    //                [new Ingredient('Rice', 1),
    //                new Ingredient('Special Biryani Masala', 2)])
    //   ];

      private recipes: Recipe[] = [];
      
      constructor(private slService: ShoppingListService, private store: Store<{shoppingList: {ingredients: Ingredient[]}}>){

      }

      setRecipes(recipes: Recipe [] ){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      }

      getRecipes(){
        return this.recipes.slice();
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
      }

      getRecipe(index: number){
          return this.recipes.slice()[index];
      }

      addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
      }
}