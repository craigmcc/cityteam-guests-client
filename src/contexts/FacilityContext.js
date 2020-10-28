import React, { createContext, useEffect, useState } from "react";

import * as FacilityClient from "../clients/FacilityClient";

// FacilityContext -----------------------------------------------------------

// A context (and associated provider) managing the list of Facilities
// that are active and available for the current user to choose.

// TODO - enforce authorization when user access is implemented

// Context Properties --------------------------------------------------------

// facilities               List of Facilities available to be selected
// selectedFacility         Currently selected Facility

// Component Details ---------------------------------------------------------

export const FacilityContext = createContext({
    facilities : [],
    selectedFacility: { id: -1, name: "UNSELECTED" }
});

// Helper functions to establish initial state
export const FacilityContextProvider = (props) => {

    const [facilities, setFacilities] =
        useState([{ id: -1, name: "Unknown" }]);
    const [selectedFacility, setSelectedFacility] =
        useState({ id: -1, name: "Unknown" });

    // useEffect call to retrieve initial values and set selected
    useEffect(() => {

        function fetchData(name) {
            FacilityClient.active()
                .then(response => {
                    console.log("FacilityContext.fetchData.available(" +
                        JSON.stringify(response.data, ["id", "name"]) + ")");
                    setFacilities(response.data);
                    if (selectedFacility.id <= 0) {
                        for (let facility of response.data) {
                            if (name === facility.name) {
                                console.log("FacilityContext.fetchData.selected(" +
                                    JSON.stringify(facility, ["id", "name"]) + ")");
                                setSelectedFacility(facility);
                            }
                        }
                    }
                })
        }

        fetchData("Portland");

    }, [selectedFacility.id]);

/*
    // Can define methods to be included in context as well
    const deassignSelectedFacility = () => {
        setSelectedFacility({ id: -1, name: "DESELECTED" });
    }

    const refreshFacilities = () => {
        FacilityClient.active()
            .then(response => {
                console.log("FacilityContext.refreshFacilities(" +
                    JSON.stringify(response.data, ["id", "name"]) + ")");
                setFacilities(response.data);
                for (let facility of response.data) {
                    if (selectedFacility.name === facility.name) {
                        console.log("FacilityContext.refreshSelectedFacility(" +
                            JSON.stringify(facility, ["id", "name"]) + ")");
                        setSelectedFacility(facility);
                    }
                }
            })
    }
*/

    // Create the context object
    const facilityContext = {
        // Data values and corresponding setters
        facilities, setFacilities,
        selectedFacility, setSelectedFacility,
    };

    // Return it, rendering children inside
    return (
        <FacilityContext.Provider value={facilityContext}>
            {props.children}
        </FacilityContext.Provider>
    );

}
