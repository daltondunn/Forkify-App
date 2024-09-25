import icons from 'url:../../img/icons.svg'; 
import View from './View.js'
import fracty from "fracty"; 

class recipeView extends View {
    _parentElement = document.querySelector('.recipe');
    _errorMsg = `We couldn't find that recipe. Try another one!`
    _msg = '';

    addHandlerRender(handler) {
      ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    } 

    // renderError(message = this._errorMsg) {
    //     const markup = `<div class="error">
    //         <div>
    //           <svg>
    //             <use href="${icons}#icon-alert-triangle"></use>
    //           </svg>
    //         </div>
    //         <p>${message}</p>
    //       </div>`

    //       this._clear();
    //       this._parentElement.insertAdjacentHTML('afterbegin', markup)  
    // }

    addHandlerServings(handler) {
      this._parentElement.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn--update-servings')
        if (!btn) return;
        const { updateTo } = btn.dataset

        if (+updateTo > 0) handler(+updateTo)
      })
    }

    addHandlerBookmark(handler) {
      this._parentElement.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn--bookmark');
        if (!btn) return

        // console.log(this._data);

        handler();
      })
    }

    _generateMarkup() {
        return `<figure class="recipe__fig">
          <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked === true ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateIngMarkup).join('')}
            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.source}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
        -->`;
        }

        _generateIngMarkup(ing) {
            return `<li class="recipe__ingredient">
                <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity !== null ? fracty(ing.quantity).toString() : ''}</div>
                <div class="recipe__description">
                <span class="recipe__unit">${ing.unit != null ? ing.unit : ''}</span>
                    ${ing.description}
                </div>
            </li>`
    }
}

export default new recipeView()