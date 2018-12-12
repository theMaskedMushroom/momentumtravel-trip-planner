import React, {Component} from 'react';
import Flight from './Flight';

class Trip extends Component
{
    constructor(props)
    {
        super(props);

        // Use these classes to properly style the background
        this.oneWayClassName = 'container rounded bg-info pt-3 pb-3 mt-4';
        this.roundTripClassName = 'container rounded bg-warning pt-3 pb-3 mt-4';

    }

    render()
    {
        let totalPrice = this.props.trip.type === 'roundTrip' ? parseInt(this.props.trip.outbound.price) + parseInt(this.props.trip.inbound.price) : parseInt(this.props.trip.outbound.price);

        return (
            <div className={this[this.props.trip.type + 'ClassName']}>
                
                <div className='d-flex justify-content-between'>
                    <h3>{this.props.trip.type}</h3>
                    <h4>total: US$ {totalPrice}</h4>
                </div>

                <Flight
                    disabled={true}
                    flight={this.props.trip.outbound}
                    tripType={this.props.trip.type}
                />

                {this.props.trip.type === 'roundTrip' && <Flight
                                                            disabled={true}
                                                            flight={this.props.trip.inbound}
                                                            tripType={this.props.trip.type}
                                                        />
                }
            </div>
        )
    }
}

export default Trip;