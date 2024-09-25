import icons from 'url:../../img/icons.svg'; 

export default class View {
    _data;

    /**
     * 
     * @param {Object | Object[]} data the data that is received and rendered (e.g recipe) 
     * @param {boolean} [render=true] if render is set to false, just generate a markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is return if render = flase
     * @this {Object} view instance
     * @author Dalton Dunn
     * @todo implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    _clear() {
        this._parentElement.innerHTML = ''
    }

    update(data){

      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup); //A neat trick that creates a DOM that lives in memory instead of on a screen. Makes checking the new Markup and the Oldup Markup possible.
      const newElements = Array.from(newDOM.querySelectorAll('*'))
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));
      
      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];

        if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
          curEl.textContent = newEl.textContent;
        }

        if (!newEl.isEqualNode(curEl)) {
          Array.from(newEl.attributes).forEach(attr => {
            curEl.setAttribute(attr.name, attr.value)
          })
        }
      })

    }

    renderSpinner = function() {
        const markup = `<div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>`
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
      }

      renderMsg(message = this._msg) {
        const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`

          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin', markup)  
    }

      renderError(message = this._errorMsg) {
        const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`

          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin', markup)  
    }
  
}