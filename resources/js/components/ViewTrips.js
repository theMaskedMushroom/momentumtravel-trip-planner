import React, {Component} from 'react';
import {connect} from 'react-redux';
import Trip from './Trip';

class ViewTrips extends Component
{
    constructor(props)
    {
        super(props);


    }

    render()
    {
        return (
            <div>
                <h2 className='mt-3'>My Trips</h2>

                {this.props.trips.map(function(trip){
                    return <Trip
                                trip={trip}
                            />
                })}
            </div>
        )
    }
}

function mapStateToProps(state)
{
    return {
        trips: state.trips
    }
}

export default connect(mapStateToProps)(ViewTrips);