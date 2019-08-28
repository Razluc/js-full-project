import axios from 'axios';
import { conn } from '../config';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){

        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${conn.key}&q=${this.query}`);
            //console.log(res);
            this.result = res.data.recipes;
        } catch(error) {
            alert(error);
        }
    }
}

