import React from 'react';
import ReactDOM from 'react-dom';
//import { createStore } from 'redux';
//import { Provider } from 'react-redux';
//import todoApp from './reduxs/reducers.js';
import Main from './main.jsx';

//let store = createStore(todoApp);
//ReactDOM.render(
//    <Provider store={store}>
//        <Main />
//    </Provider>,
//    document.getElementById('main-holder')
//);

ReactDOM.render(<Main />, document.getElementById('main-holder'));

