// Global app controller
import Search from './modules/Search';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import { elements, renderLoader, clearLoader } from './view/base';
import Recipe from './modules/Recipe';

/** Glogal state of the app
 * - Search Objec
 * - Current recipes
 * - Shopping list object
 * - Linked recipes
 */
const state = {};

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
        
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

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
    }
    console.log(state.recipe);
})