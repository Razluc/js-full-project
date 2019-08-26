// Global app controller
import Search from './modules/Search';
import * as searchView from './view/searchView';
import { elements, renderLoader, clearLoader } from './view/base';

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
        await state.search.getResults();

        // 5 Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    } 
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

// const search = new Search('pizza');
// console.log(search);
// search.getResults();

// https://www.food2fork.com/api/search
// 0a7feb282a2bf222d70cd7446f37ec77