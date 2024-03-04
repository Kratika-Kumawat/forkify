import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0. Update results view to mark selected search result.
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //1. loading recipe
    await model.loadRecipe(id); //cause this function will return a promise.


    //2. rendering recipe.
    recipeView.render(model.state.recipe);
    // const recipeView = new RecipeView(model.state.recipe);

    //for testing purpose
    // controlServings();

  } catch (err) {
    recipeView.renderError();
  }

};

const controlSearchResults = async function () {
  try {

    resultsView.renderSpinner();

    //1. get search query.
    const query = searchView.getQuery();
    if (!query) return;

    //2. loading the search results.
    await model.loadSearchResults(query);

    //3.Render results.
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4. Render initial pagination buttons.
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {

  //1.Render NEW results.
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render NEW initial pagination buttons.
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {

  console.log(newServings);
  //update the recipe servings (in state).
  model.updateServings(newServings);

  //update the recipe view as well.
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update the recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks.
  bookmarksView.render(model.state.bookmarks); // Hello, I make the original render call. My end goal is to add the markup to the DOM!
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner.
    addRecipeView.renderSpinner();

    //Upload new recipe data.
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe.
    recipeView.render(model.state.recipe);

    //Display a success message.
    addRecipeView.renderMessage();

    //Render bookmark view.
    bookmarksView.render(model.state.bookmarks);

    //Change id in the url.
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    // window.history.back() help us to move backward in the browser history.

    

    //close form window.
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

//the better way to do the same thing.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateRecipe(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();