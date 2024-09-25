import View from './View.js'
import icons from 'url:../../img/icons.svg'; 

class paginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkUpPrevButton(page) {
        return `
            <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>`
    }

    _generateMarkUpNextButton(page) {
        return `
            <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);


        // Page 1 and there are other pages
        if(currentPage === 1 && numPages > 1) {
            return this._generateMarkUpNextButton(currentPage)
        }

        // Last Page
        if (currentPage === numPages && numPages > 1) {
            return this._generateMarkUpPrevButton(currentPage)
        }
        // Other Page
        if (currentPage < numPages) {
            return (this._generateMarkUpNextButton(currentPage) + this._generateMarkUpPrevButton(currentPage))          
        }

        // Page 1 and there are no other pages
        return ''
    }

    addHandlerPagination(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline')

            if (!btn) return

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        })
    }
}

export default new paginationView();