import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
    _message = '';

    addHandlerRender(handler){
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
        
        //previewView.render(bookmark, false) --> Ok! I have my data (bookmarks). Oh, I noticed render = false: I will only deliver a string to _generateMarkup in bookmarksView
    };
};

export default new BookmarksView();