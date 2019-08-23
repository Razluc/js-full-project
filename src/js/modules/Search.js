import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        const key = '0a7feb282a2bf222d70cd7446f37ec77';
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            //console.log(res);
            this.result = res.data.recipes;
        } catch(error) {
            alert(error);
        }
    }
}

