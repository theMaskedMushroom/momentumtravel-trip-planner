<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Flight;
use App\Airport;
use App\Airline;

class FlightController extends Controller
{
    /**
     * Looks for flights that make up trips of the given type,
     * adds the proper data to flights.
     * Only 2 trip types available: 'oneWay' and 'roundTrip'
     */
    public function findFlights(Request $request)
    {
        // Let's extract our values from the request body, make things handy
        $tripType = $request->input('type');
        $departureCode = $request->input('departure');
        $arrivalCode = $request->input('arrival');

        // Start by looking for outbound flights, cuz nothing happens if you can't fligh out
        $outbound = Flight::where('departure_from','=', $departureCode)
                            ->where('arrival_at', '=', $arrivalCode)
                            ->get();

        if($outbound->isEmpty())
        {
            // early return for empty outbound flight. Can't go further if you can't fligh out!
            // so return empty array
            return $outbound->toJson();
        }
        else
        {
           // Need to grab the airport data in order to append it to flight records.
           // We'll need stuff like names and countries to produce a dataset that is fully usable.
           $departureAirport = Airport::where('iata_code', '=', $departureCode)->get()[0];
           $arrivalAirport = Airport::where('iata_code', '=', $arrivalCode)->get()[0];

           // Add needed data to flight records
           
           foreach ($outbound as $flight) {

               // Add type, departure_name, arrival_name
               $flight['type'] = 'outbound';
               $flight['departure_name'] = $departureAirport->name . ', ' . $departureAirport->city . ' (' . $departureAirport->iata_code . ')';
               $flight['arrival_name'] = $arrivalAirport->name . ', ' . $arrivalAirport->city . ' (' . $arrivalAirport->iata_code . ')';

               // // Add airline
               $flight->airline = Airline::select('name')
                                            ->where('iata_code', '=', substr($flight->flight_id, 0, 2))
                                            ->get()[0]->name;
           }

           // Return if this is a one way trip. We need nothing else.
           if ($tripType == 'oneWay')
           {
               return $outbound->toJson();
           }

        }

        // This is not a one Way trip, we assume Round Trip and look for return flights
        $inbound = Flight::where('departure_from','=', $arrivalCode)
        ->where('arrival_at', '=', $departureCode)
        ->get();

        if ($inbound->isEmpty())
        {
        // Can't make a round trip, return empty array
        return $inbound->toJson();
        }

        foreach ($inbound as $flight) {

            // Add type, departure_name, arrival_name
            $flight['type'] = 'inbound';
            $flight['departure_name'] = $arrivalAirport->name . ', ' . $arrivalAirport->city . ' (' . $arrivalAirport->iata_code . ')';
            $flight['arrival_name'] = $departureAirport->name . ', ' . $departureAirport->city . ' (' . $departureAirport->iata_code . ')';

            // // Add airline
            $flight->airline = Airline::select('name')
                                         ->where('iata_code', '=', substr($flight->flight_id, 0, 2))
                                         ->get()[0]->name;
        }

        // For now, we only have 'oneWay' and 'roundTrip', so return this as a roundtrip
        $roundTrips = $outbound->merge($inbound);

        return $roundTrips->toJson();
    }
}