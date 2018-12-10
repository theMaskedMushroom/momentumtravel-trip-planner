import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Header from './Header';
import SearchFlights from './SearchFlights';


export default class TripPlanner extends Component {
    render() {
        return (<Provider store={store}>
                    <Router>
                        <div className="container">
                            <Header />
                            <Route exact={true} path='/' component={SearchFlights} />
                        </div>
                    </Router>
                </Provider>
        );
    }
}


ReactDOM.render(<TripPlanner />, document.getElementById('app'));