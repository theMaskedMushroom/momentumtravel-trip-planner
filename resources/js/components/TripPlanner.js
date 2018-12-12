import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Header from './Header';
import SearchFlights from './SearchFlights';
import ViewTrips from './ViewTrips';

/**
 * This is the application's root, the one rendered to the app div on the HTML page served by Laravel.
 */
export default class TripPlanner extends Component {
    render() {
        return (<Provider store={store}>
                    <Router>
                        <div className="container">
                            <Header />
                            <Route exact={true} path='/' component={SearchFlights} />
                            <Route exact={true} path='/trips' component={ViewTrips} />
                        </div>
                    </Router>
                </Provider>
        );
    }
}


ReactDOM.render(<TripPlanner />, document.getElementById('app'));