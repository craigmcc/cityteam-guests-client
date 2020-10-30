import React, { useContext } from "react";

import { FacilityContext } from "../contexts/FacilityContext";
import SelectElement from "../library/SelectElement";

// FacilitySelector ----------------------------------------------------------

// Render a select list of the Facilities that the current user
// is authorized to deal with.

// Incoming Properties -------------------------------------------------------

// autoFocus                Should this field receive autoFocus? [false]
// elementClassName         CSS styles for overall <Row> [not rendered]
// fieldClassName           CSS styles for field <Col> [col-8]
// fieldName                ID and name for this select [selectedFacility]
// handleFacility           Handle (facility) when selected [no handler]
// label                    Label text [Current Facility:]
// labelClassName           CSS styles for label <Col> [col-4]
// options                  Array of (Facility) for available options [*REQUIRED*]

// Component Details ---------------------------------------------------------

export const FacilitySelector = (props) => {

    const facilityContext = useContext(FacilityContext);

    const calculateOptions = () => {
        let options = [];
        facilityContext.facilities.forEach(facility => {
            options.push({ value: facility.id, description: facility.name})
        })
        return options;
    }

    const onChange = (event) => {
        let newId = Number(event.target.value);
        for (let facility of facilityContext.facilities) {
            if (facility.id === newId) {
                console.info("FacilitySelector.onChange("
                    + JSON.stringify(facility, ["id", "name"])
                    + ")");
                facilityContext.setSelectedFacility(facility);
                if (props.handleFacility) {
                    props.handleFacility(facility);
                }
                break;
            }
        }
    }

    return (

        <SelectElement
            autoFocus={props.autoFocus ? props.autoFocus : null}
            elementClassName={props.elementClassName ? props.elementClassName : null}
            fieldClassName={props.fieldClassName ? props.fieldClassName : "col-8"}
            fieldName={props.fieldName ? props.fieldName : "selectedFacility"}
            fieldValue={facilityContext.selectedFacility.id}
            label={props.label ? props.label : "Current Facility:"}
            labelClassName={props.labelClassName ? props.labelClassName : "col-4"}
            onChange={onChange}
            options={calculateOptions()}
        />

    );

}

export default FacilitySelector;
