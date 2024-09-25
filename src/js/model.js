import { indexOf } from 'core-js/es/array'
import {API_URL, RESULTS_PER_PAGE, KEY} from './config.js'
import { AJAX } from './helpers.js'


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
    
}

const createRecipeObject = function(data) {
    const { recipe } = data.data

    return state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ingredients: recipe.ingredients,
        servings: recipe.servings,
        source: recipe.source_url,
        cookTime: recipe.cooking_time,
        ...(recipe.key && {key: recipe.key}), //The && key will short circuit. This is kind of like checking to see if key is true, if not exit the command / A trick to add conditional formatting to objects being made
    };
}

export const loadRecipe = async function(id) {
    try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`)

    

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id )){
        state.recipe.bookmarked = true;
       }  else {
        state.recipe.bookmarked = false;
       }

    // console.log(state.recipe);   
    } catch(err) {
        console.error(`${err} 💥💥💥`)
        throw err;
    }
}

export const loadSearchResult = async function(query) {
    try {
        state.search.query = query;
        const {data} = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                image: rec.image_url,
                publisher: rec.publisher,
                ...(rec.key && {key: rec.key}),
            }
        });
        state.search.page = 1;
    } catch(err) {
        console.error(`${err} 💥💥💥`)
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage // 0;
    const end = (page * state.search.resultsPerPage)// 9;


    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe)

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks()
}

export const deleteBookmark = function(id) {
    // Taking the given ID out of the bookmarks
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark Current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks()
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage)
}

init()

const clearBookmarks = function() {
    localStorage.clear('bookmarks')
}

export const uploadRecipe = async function(newRecipe) {

    try {
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error (`Wrong ingredient format! Please use the correct format.`)
        const [quantity, unit, description] = ingArr;
        return {quantity: quantity ? +quantity : null , unit : unit ? unit : null, description : description ? description[0].toUpperCase() + description.slice(1) : description }
    });

    const recipeArr = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        servings: +newRecipe.servings,
        cooking_time: +newRecipe.cookingTime,
        ingredients,
    }

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipeArr)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
    
    } catch(err) {
        throw err
    }
}

// clearBookmarks();