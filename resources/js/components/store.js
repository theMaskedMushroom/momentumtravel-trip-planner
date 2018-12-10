import {createStore} from 'redux';

let initialState = {
    departure: null,
    arrival: null
}

let reducer = function(state, action)
{
    let newState;

    switch(action.type)
    {
        case 'airportSelect':
            // Deep copy the state
            newState = JSON.parse(JSON.stringify(state));
            newState[action.payload.type] = action.payload.airport;
            return newState;

        default:
            return state;
    }
}

let store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;