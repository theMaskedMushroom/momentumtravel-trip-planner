<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Airport;

class AirportController extends Controller
{
    /**
     * used to search airports from autocomplete select boxes.
     */
    public function getSuggestions($search)
    {
        $suggestions = Airport::select('id', 'name', 'city', 'country', 'iata_code')
                            ->where('name', 'LIKE', "{$search}%")
                            ->orWhere('city', 'LIKE', "{$search}%")
                            ->orWhere('iata_code', 'LIKE', "{$search}%")
                            ->get();

        // We need to filter out the entries where iata_code is = '\N' (they are useless)
        $filtered_suggestions = $suggestions->filter(function($airport){
            return $airport->iata_code != '\N';
        });

        return $filtered_suggestions->values()->toJson();
    }
}
