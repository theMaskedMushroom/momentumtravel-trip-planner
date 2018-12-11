import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import AirportSelect from './AirportSelect';

class SearchFlights extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            tripType: 'oneWay',
            flights: []
        }

        // Values to be used locally
        this.outboundClassName = 'btn btn-block btn-info';
        this.inboundClassName = 'btn btn-block btn-warning';

        // Bindings
        this.onTripTypeChange = this.onTripTypeChange.bind(this);
        this.onFindFlights = this.onFindFlights.bind(this);
    }

    /**
     * Radio input change handler
     */
    onTripTypeChange(evt)
    {
        this.setState({tripType: evt.target.value});
    }

    /**
     * Find flights button click handler
     */
    onFindFlights(evt)
    {
        // Validate that both departure and arrival airports are chosen
        let errorMsg = ''

        if (this.props.departure === null)
        {
            errorMsg += "Please select a departure airport.\n"
        }
        if(this.props.arrival === null)
        {
            errorMsg += "Please select an arrival airport."
        }

        if (errorMsg)
        {
            alert(errorMsg);
            return;
        }

        // Reset the current flights displayed
        this.setState({flights: []});

        // Fetch the flights
        let postData = {
            type: this.state.tripType,
            departure: this.props.departure.iata_code,
            arrival: this.props.arrival.iata_code
        }

        axios.post('/api/find_flights', postData)
            .then(function(response){
                this.setState({flights: response.data});
                
                if (response.data.length === 0)
                {
                    alert("Sorry, no flights available.");
                }
            }.bind(this))
            .catch(function(error){ console.log(error)})


        // Finally, reset the airport select boxes and values
        this.props.dispatch({
            type: 'airportSelect',
            payload: {
                type: 'departure',
                airport: null
            }
        })

        this.props.dispatch({
            type: 'airportSelect',
            payload: {
                type: 'arrival',
                airport: null
            }
        })
    }

    /**
     * Used to reset any transient values
     */
    componentWillUnmount()
    {
        // Reset the airport selects
        this.props.dispatch({
            type: 'airportSelect',
            payload: {
                type: 'departure',
                airport: null
            }
        })

        this.props.dispatch({
            type: 'airportSelect',
            payload: {
                type: 'arrival',
                airport: null
            }
        })
    }

    render()
    {
        return (
            <div>
                <h2 className='mt-3'>Search flights</h2>

                <div className="radio mt-5">
                    <label>
                        <input type="radio" name="radioGroup" id="optionsRadios1" value="oneWay" 
                                onChange={this.onTripTypeChange} checked={this.state.tripType === 'oneWay'}/>
                        One Way
                    </label>
                </div>
                <div className="radio mb-3">
                    <label>
                        <input type="radio" name="radioGroup" id="optionsRadios2" value="roundTrip"
                                onChange={this.onTripTypeChange} checked={this.state.tripType === 'roundTrip'}/>
                        Round Trip
                    </label>
                </div>

                <div className='mb-3'>
                    <AirportSelect
                        placeholder='Departure airport...'
                        type='departure'
                    />
                </div>

                <AirportSelect
                    placeholder='Arrival airport...'
                    type='arrival'
                />

                <div className='text-info mt-4 mb-1'>Flights are available every day of the week. Only departure and arrival times are relevant and displayed in flight details.</div>

                <button className='btn btn-primary'
                        onClick={this.onFindFlights}>Find Flights</button>

                {this.state.flights.length !== 0 &&   <div className='text-center mt-4'>
                                                        <h3>Flights</h3>
                                                        <div className='text-info mt-2'>Select flights below by clicking on the headers.</div>
                                                    </div>
                }

                {this.state.flights.map((flight)=> 
                    <div className='card mt-3'>
                        <button className={this[flight.type + 'ClassName']} disabled=''>{flight.type}</button>
                        <div className='text-center mt-3'><h4>{flight.airline + ' ' + flight.flight_id}</h4></div>
                        <div><strong>From: </strong>{flight.departure_name}</div>
                        <div><strong>To:   </strong>{flight.arrival_name}</div>
                        <div>{flight.departure_time}</div>
                        <div>{flight.arrival_time}</div>
                        <div>US$ {flight.price}</div>
                    </div>
                )}
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