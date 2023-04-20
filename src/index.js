import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// Step 0:
// Step 1: import createSagaMiddleware
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
//Step 8: import axios , takeEvery and put

import axios from 'axios';
//put is dispatch they do the same thing
import { takeEvery, put } from 'redux-saga/effects';



const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};   

// Make a GET request and pass the data to redux
function* fetchElements() {
    try {
        // wait for a server response.....
        const elements = yield axios.get('/api/element');
        //after we get a response, this will run and we will dispatch an action put
        yield put({ type: 'SET_ELEMENTS', payload: elements.data });
    } catch(error) {
        console.log(`error in fetchElements: ${error}`);
        alert('Something went wrong.');
    }


}//ends fetchElements function

function* postElement(action) {
    try {
        yield axios.post('/api/element', action.payload);
        // call the GET
        yield put({ type: 'FETCH_ELEMENTS'});
        action.setNewElement('');
    } catch (error) {
        console.log(`error in postElement`);
        alert('something went wrong')
    }
}// ends 

// Step:3 create a root saga 
// this is the saga that will watch for actions
function* rootSaga() {
    //! fetch_elements is our action type 
    //! do not use the same action as the reducer
yield takeEvery ('FETCH_ELEMENTS', fetchElements);
yield takeEvery ('ADD_ELEMENT', postElement);
//More sagas go here

}

// Step4: create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    // Step 5: add middleware to redux
    applyMiddleware(sagaMiddleware, logger),
);

//Step 6: add our root saga to our middleware
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
