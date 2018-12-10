import React, {Component} from 'react';
import {connect} from 'react-redux';
import AirportSelect from './AirportSelect';

class SearchFlights extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {

        }


    }

    render()
    {
        return (
            <div>
                <h2>Search flights</h2>

                <AirportSelect
                    placeholder='Departure airport...'
                    type='departure'
                />

                <AirportSelect
                    placeholder='Arrival airport...'
                    type='arrival'
                />

                <button className='btn btn-primary'>Find Flights</button>
            </div>
        )
    }
}

function mapStateToProps(state)
{
    return {
        departure: state.departure,
        arrival: state.arrival
    }
}

export default connect(mapStateToProps)(SearchFlights);