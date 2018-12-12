import {createStore} from 'redux';

let initialState = {
    departure: null,
    arrival: null,
    currentTripSelect:{
        type:'',
        outbound: null,
        inbound: null
    },
    trips: []
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

        case 'flightSelect':
            // Deep copy the state
            newState = JSON.parse(JSON.stringify(state));
            newState.currentTripSelect.type = action.payload.tripType;
            newState.currentTripSelect[action.payload.flightType] = action.payload.flight;
            return newState;

        case 'selectCurrentTrip':
            newState = JSON.parse(JSON.stringify(state));
            newState.trips.push(state.currentTripSelect);
            return newState;

        case 'resetCurrentTripSelect':
            newState = JSON.parse(JSON.stringify(state));
            newState.currentTripSelect = {
                type: '',
                outbound: null,
                inbound: null
            }
            return newState;

        default:
            return state;
    }
}

let store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;