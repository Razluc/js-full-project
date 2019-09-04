// Global app controller
import Search from './modules/Search';
import Recipe from './modules/Recipe';
import List from './modules/List';
import Likes from './modules/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import { elements, renderLoader, clearLoader } from './view/base';


/** Glogal state of the app
 * - Search Objec
 * - Current recipes
 * - Shopping list object
 * - Linked recipes
 */
const state = {};
window.state = state;

const controlSearch = async () => {
    // 1 Get the query from view
    const query = searchView.getInput();

    if(query){
        // 2 New search object added to state
        state.search = new Search(query);
        // 3 Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // 4 Search for recipes
        try{
            await state.search.getResults();
            // 5 Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error){
            alert('oops..');
            clearLoader();
        }
    } 
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline ');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);  
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    // Get Id from url
    const id = window.location.hash.replace('#', '');

    if(id){ 
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search){
            searchView.higlightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);
        try{
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error){
            alert('Error processing!');
        }
        console.log(state.recipe.ingredients);
    }
}
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * Recipe Controller
 */
const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list){
        state.list = new List();
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handle  delete and update shopping list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){

        // Delete from state 
        state.list.deleteItem(id);

        // Detele from UI
        listView.deletItem(id);
        // Handle 
    } else if(e.target.matches('.shopping_count-value')){
        const val = parseInt(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

/**
 * Recipe Controller
 */
const controlLike = () => {
    if(!state.likes){
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Tokkgle the like button

        // Add like to UI list
        console.log(state.likes)
        // User has liked current recipe
    }else{
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Tokkgle the like button

        // Remove like to UI list
        console.log(state.likes);
    }
};


// Handling recipe button clicks

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrrease button 
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else  if(e.target.matches('.btn-increase, .btn-increase *')){
        // Increase button 
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add ingredients to shopping list
         controlList();
    } else if(e.target.matches('.recipe__love, .recipe_love *')){
        // Like Controller
        controlLike();
    }
})

window.l = new List();