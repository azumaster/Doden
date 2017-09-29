// import React from 'react';
// import ReactDOM from 'react-dom';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Entry from './pages/entry.jsx';
import reducer from './redux/reducers/index.js';

let store = createStore(reducer, applyMiddleware(thunk));
const render = () =>{
    ReactDOM.render(<Provider store={store}>
        <Entry />
    </Provider>, document.getElementById('app'));
};

store.subscribe(render);
render();