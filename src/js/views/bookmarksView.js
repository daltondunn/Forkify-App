import View from './View.js'
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg'; 

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it! n_n';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', function() {
            handler();
        })
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('')
    }

}

export default new BookmarksView()