import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import AsyncSelect from 'react-select/lib/Async';

class AirportSelect extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            inputValue: '',
            selectedOption: null
        }

        // Binding and other method massaging
        this.onChange = this.onChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
    }

    /**
     * Called when the user selects an option
     */
    onChange(option)
    {
        // Keep the option in our local state
        this.setState({selectedOption: option});

        // Option is null if selection is reset
        this.props.dispatch({
            type:'airportSelect',
            payload: {
                type: this.props.type,
                airport: (option ? option.value : null)
            }
        })
    }

    /**
     * Called when the user types
     */
    onInputChange(inputValue)
    {
        if (inputValue != '')
        {
            this.setState({inputValue});
        }

        return inputValue;
    }

    /**
     * Load method passed to the AsyncSelect
     * 
     * @param inputValue    String
     * @param callback      function called by the Async component
     */
    loadOptions(inputValue, callback)
    {
        axios.get('/api/suggest_airport/' + inputValue)
                    .then(function(response){

                        var options = [];

                        // Format the options {value:'', label:''}
                        for(let airport of response.data)
                        {
                            options.push({value: airport,
                                          label: `${airport.name}, ${airport.city}, ${airport.country} (${airport.iata_code})`
                                        })
                        }

                        // And let the select component take the options
                        callback(options);
                    })
                    .catch(function(error){
                        console.log('error: ' + error);
                    })
    }

    render()
    {
        return <AsyncSelect
                    value={!this.props[this.props.type] ? null : this.state.selectedOption}
                    cacheOptions
                    isClearable
                    placeholder={this.props.placeholder}
                    loadOptions={this.loadOptions}
                    onInputChange={this.onInputChange}
                    onChange={this.onChange}
                />
    }
}

function mapStateToProps(state)
{
    return {
        departure: state.departure,
        arrival: state.arrival
    }
}

export default connect(mapStateToProps)(AirportSelect);