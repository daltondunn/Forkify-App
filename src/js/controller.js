// import { search } from 'core-js/fn/symbol';
import * as model from './model.js'
import {MODAL_CLOSE_SECS} from './config.js'
import recipeView from './views/recipeView.js';
import searchbarView from './views/searchbarView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/actual';
import 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}


const controlRecipe = async function() {

try {

  // Getting Hash ID
  const id = window.location.hash.slice(1);
  
  if (!id) return;

  // Update Results view to mark selected search result
  resultsView.update(model.getSearchResultsPage())

  // Update bookmarks panel
  bookmarksView.update(model.state.bookmarks)

  //1. Loading Recipe & while loading recipe show loading spinner
  recipeView.renderSpinner();

  await model.loadRecipe(id)
  

  //2. Rendering the recipe
  recipeView.render(model.state.recipe) 

   
} catch(err) {
  recipeView.renderError()
  console.error(err);
}

}

const controlSearchResults = async function() {
  try {
    // Show Spinner showing that users request is processing
    resultsView.renderSpinner();

    //Getting search query
    const query = searchbarView.getQuery();
    if (!query) return;


    //Getting Search Results based on string provided in query
    await model.loadSearchResult(query);

    // Render the results
    resultsView.render(model.getSearchResultsPage())

    // Render the initial pagination
    paginationView.render(model.state.search)

  } catch(err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) {
  // Render the new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // Render the new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function(num) {
  // Update the recipe servings (in state)
  model.updateServings(num)

  // Update the recipe view
  // recipeView.render(model.state.recipe) Old way of updating
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmarked === true)  {
    model.addBookmark(model.state.recipe)
  } else if (model.state.recipe.bookmarked === true) {
     model.deleteBookmark(model.state.recipe.id)
  }
  
  // Update Recipe View
  recipeView.update(model.state.recipe)

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  try {

    //Show Spinner while recipe is loading
    addRecipeView.renderSpinner()

    //Upload the new recipe
   await model.uploadRecipe(newRecipe)

   // Render recipe
   recipeView.render(model.state.recipe)

   // Display Success Message
   addRecipeView.renderMsg();

   // Close the form window to show new recipe
   setTimeout(function() {
    addRecipeView.toggleWindow();
   }, MODAL_CLOSE_SECS * 1000)

   // Render bookmark view
   bookmarksView.render(model.state.bookmarks)

   // Change ID in the URL; pushState() - allows us to change the URL without having to update the page
   window.history.pushState(null, '', `#${model.state.recipe.id}`);
   console.log(window.history);

  } catch(err) {
    console.error(` 💥 ${err} 💥`);
    addRecipeView.renderError(err.message)
  }
}

const newFeature = function() {
  console.log(`Welcome to the application`);
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchbarView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
  newFeature();
}
init();



