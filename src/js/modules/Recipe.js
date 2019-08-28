import axios from 'axios';
import { conn } from '../config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${conn.key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch (error){
            console.log(error);
            alert('Something went wrong...');
        }
    }

    calcTime() {
        // For each 3 ingredients we need 15 min.
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}