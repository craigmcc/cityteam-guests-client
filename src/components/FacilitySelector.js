import React, { useContext, useEffect, useState } from "react";

import { FacilityContext } from "../contexts/FacilityContext";
import SelectElement from "../library/SelectElement";

// FacilitySelector ----------------------------------------------------------

// Render a select list of the Facilities that the current user
// is authorized to deal with.

// Incoming Properties -------------------------------------------------------

// action                   Button text for the action button [no action button]
// actionClassName          CSS styles for  action <Col> [col-2]
// actionDisabled           Mark action button as disabled [(index < 0)]
// actionSize               Action button size ("lg", "sm") [sm]
// actionVariant            Action button style variant [outline-info]
// autoFocus                Should this field receive autoFocus? [false]
// elementClassName         CSS styles for overall <Row> [not rendered]
// fieldClassName           CSS styles for field <Col> [col-8]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                ID and name for this select [selectedFacility]
// handleFacility           Handle valid (facility) when selected [no handler]
// label                    Label text [Current Facility:]
// labelClassName           CSS styles for label <Col> [col-2]
// options                  Array of (Facility) for available options [*REQUIRED*]

// Component Details ---------------------------------------------------------

export const FacilitySelector = (props) => {

    const facilityContext = useContext(FacilityContext);

    const [index, setIndex] = useState(-1);

    useEffect(() => {
        let newIndex = -1;
        facilityContext.facilities.forEach((facility, thisIndex) => {
            if (facility.id === facilityContext.selectedFacility.id) {
                newIndex = thisIndex;
            }
        });
        console.info("FacilitySelector.useEffect("
            + newIndex
            + ")");
        setIndex(newIndex)
    }, [facilityContext.facilities, facilityContext.selectedFacility.id]);

    const calculateOptions = () => {
        let results = [];
        results.push({value: -1, description: "(Select)"});
        facilityContext.facilities.forEach((facility, newIndex) => {
            results.push({ value: newIndex, description: facility.name})
        })
        return results;
    }

    const onChange = (event) => {
        let newIndex = Number(event.target.value);
        let newFacility;
        if (newIndex >= 0) {
            newFacility = facilityContext.facilities[newIndex];
            console.info("FacilitySelector.onChange("
                + newIndex + ", "
                + JSON.stringify(newFacility, ["id", "name"])
                + ")");
            facilityContext.setSelectedFacility(newFacility);
            if (props.handleFacility && !props.action) {
                props.handleFacility(newFacility);
            }
        } else {
            newFacility = { id: -1, name: "UNSELECTED" };
            console.info("FacilitySelector.onChange(-1)");
        }
        setIndex(newIndex);
        facilityContext.setSelectedFacility(newFacility);
        if (props.handleFacility && !props.action && (newIndex >= 0)) {
            props.handleFacility(newFacility);
        }
    }

    const onClick = () => {
        let newFacility = facilityContext.facilities[index];
        console.info("FacilitySelector.onClick("
            + JSON.stringify(newFacility, ["id", "name"])
            + ")");
        if (props.handleFacility && (index >= 0)) {
            props.handleFacility(newFacility);
        }
    }

    return (

        <SelectElement
            action={props.action ? props.action : null}
            actionClassName={props.actionClassName ? props.actionClassName : "col-2"}
            actionDisabled={props.actionDisabled ? props.actionDisabled : index < 0}
            actionSize={props.actionSize ? props.actionSize : null}
            actionVariant={props.actionVariant ? props.actionVariant : "outline-primary"}
            autoFocus={props.autoFocus ? props.autoFocus : null}
            elementClassName={props.elementClassName ? props.elementClassName : null}
            fieldClassName={props.fieldClassName ? props.fieldClassName : "col-8"}
            fieldDisabled={props.fieldDisabled ? props.fieldDisabled : null}
            fieldName={props.fieldName ? props.fieldName : "selectedFacility"}
            fieldValue={index}
            label={props.label ? props.label : "Current Facility:"}
            labelClassName={props.labelClassName ? props.labelClassName : "col-2"}
            onChange={onChange}
            onClick={onClick}
            options={calculateOptions()}
        />

    );

}

export default FacilitySelector;
