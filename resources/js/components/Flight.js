import React, {Component} from 'react';
import {connect} from 'react-redux';

class Flight extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            selected: false
        }

        // Css classes for 'outbound' 'inbound' and 'selected' (applied to the button header)
        this.outboundClassName = 'btn btn-block btn-info';
        this.inboundClassName = 'btn btn-block btn-warning';
        this.selectedClassName = 'btn btn-block btn-success';

        // We need this to disable regardless of state, props or whatever
        this.disabled = false;

        // Bindings
        this.onFlightSelect = this.onFlightSelect.bind(this);
    }

    /**
     * The visual and functional state depends on which flights have been selected.
     * Only one flight type can be selected at a time.
     * If selected flights satisfy the trip type, we confirm trip selection and disable.
     */
    onFlightSelect(evt)
    {  
        // For one way trips, we select and ask right away if this is the trip they want
        if (this.props.tripType === 'oneWay')
        {
            if(window.confirm('Are you satisfied with this trip?'))
            {
                // Mark this flight as selected
                this.setState({selected: true});

                // Force disable this flight button (others will disable automagically)
                this.disabled = true;

                // keep this flight in the store's currentTripSelect
                this.props.dispatch({
                    type: 'flightSelect',
                    payload: {
                        tripType: this.props.tripType,
                        flightType: this.props.flight.type,
                        flight: this.props.flight
                    }
                })

                // Ask the store to keep this trip 
                this.props.dispatch({
                    type: 'selectCurrentTrip'
                })

                // done, bye bye
                return;
            }

            return;
        }


        // Now for round trips
        let outbound = this.props.flight.type === 'outbound';
        let inbound = this.props.flight.type === 'inbound';

        if(!this.props.currentTripSelect.outbound && !this.props.currentTripSelect.inbound)// none selected, select this
        {
            // Set state to selected
            this.setState({selected: true});

            // And select the current flight
            this.props.dispatch({
                type: 'flightSelect',
                payload: {
                    tripType: this.props.tripType,
                    flightType: this.props.flight.type,
                    flight: this.props.flight
                }
            })
        }
        else if (outbound && this.props.currentTripSelect.outbound && !this.props.currentTripSelect.inbound ||
                inbound && this.props.currentTripSelect.inbound && !this.props.currentTripSelect.outbound)// only this flight type selected, deselect
        {
            // Set state not selected
            this.setState({selected: false});

            // And deselect the current flight
            // And select the current flight
            this.props.dispatch({
                type: 'flightSelect',
                payload: {
                    tripType: this.props.tripType,
                    flightType: this.props.flight.type,
                    flight: null
                }
            })
        }
        else if (outbound && this.props.currentTripSelect.inbound && !this.props.currentTripSelect.outbound ||
            inbound && this.props.currentTripSelect.outbound && !this.props.currentTripSelect.inbound)// last flight to be selected, confirm trip    }
        {
            if(window.confirm('Are you satisfied with this trip?'))
            {
                // Mark this flight as selected
                this.setState({selected: true});

                // Force disable this flight button (others will disable automagically)
                this.disabled = true;

                // keep this flight in the store's currentTripSelect
                this.props.dispatch({
                    type: 'flightSelect',
                    payload: {
                        tripType: this.props.tripType,
                        flightType: this.props.flight.type,
                        flight: this.props.flight
                    }
                })

                // Ask the store to keep this trip 
                this.props.dispatch({
                    type: 'selectCurrentTrip'
                })

                // done, bye bye
                return;
            }

            return;
        }
    }

    /**
     * In case of a round trip, it is possible the the other type of flight was selected last,
     * in which case we need to disable on update.
     * We'll essentially force disable everything.
     */
    componentDidUpdate()
    {
        if (this.props.currentTripSelect.outbound && this.props.currentTripSelect.inbound && !this.disabled)
        {
            this.disabled = true;

            // trigger a rerender
            this.setState({bogus:'blah'});
        }
    }

    render()
    {
        // Button color (class) is different when selected and when not (then, it depends on flight type)
        let buttonClass = this.state.selected ? this.selectedClassName : this[this.props.flight.type + 'ClassName'];

        // Disabled when set explicitly via props or locally, otherwise, see if we have a flight of same type in
        // current trip select (can only have one per trip) and it's not us (selected) in which case, we disable
        let disabled = this.props.disabled || this.disabled ? 'disabled' : (this.props.currentTripSelect[this.props.flight.type] && !this.state.selected ? 'disabled' : '');

        return (
            <div className='card mt-3'>
                        <button className={buttonClass}
                                disabled={disabled}
                                onClick={this.onFlightSelect}>
                                {this.props.flight.type}
                        </button>
                        <div className='text-center mt-3'><h4>{this.props.flight.airline + ' ' + this.props.flight.flight_id}</h4></div>
                        <div className='ml-2'><strong>From: </strong>{this.props.flight.departure_name}</div>
                        <div className='ml-2'><strong>To:   </strong>{this.props.flight.arrival_name}</div>
                        
                        <div className='d-flex justify-content-around mt-3'>
                            <div className='text-center'>
                                <kbd>departure</kbd>
                                <div>{this.props.flight.departure_time}</div>
                            </div>
                            <div className='text-center'>
                                <kbd>arrival</kbd>
                                <div>{this.props.flight.arrival_time}</div>
                            </div>
                        </div>

                        <div className='text-right mr-2'>US$ {this.props.flight.price}</div>
            </div>
        )
    }
}

function mapStateToProps(state)
{
    return {
        currentTripSelect: state.currentTripSelect
    }
}

export default connect(mapStateToProps)(Flight);