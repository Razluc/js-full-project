// Global app controller
// import str from './modules/Search';

//import {add, multiply as m, id} from './view/searchView';
//console.log(`testare ${add(2,5)} si id: ${id} si multiply: ${m(id, 10)}`);

// import * as searchView from './view/searchView';

// console.log(`testare ${searchView.add(2,5)} si id: ${searchView.id} si multiply: ${searchView.multiply(searchView.id, 10)}`);

import axios from 'axios';

async function getResults(query){
    const key = '0a7feb282a2bf222d70cd7446f37ec77';
    try{

    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes;

    // console.log(res);
    // console.log(recipes);


    } catch(error) {
        alert(error);
    }
}

// getResults('pizza');

// https://www.food2fork.com/api/search
// 0a7feb282a2bf222d70cd7446f37ec77