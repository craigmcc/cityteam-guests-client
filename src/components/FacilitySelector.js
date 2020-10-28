import React, { useContext } from "react";

import { FacilityContext } from "../contexts/FacilityContext";
import SelectElement from "../library/SelectElement";

// FacilitySelector ----------------------------------------------------------

// Render a select list of the Facilities that the current user
// is authorized to deal with.

// Incoming Properties -------------------------------------------------------

// elementClassName         CSS styles for overall <Row> [not rendered]
// fieldClassName           CSS styles for field <Col> [not rendered]
// handleSelect             Handle (facility) when selected [no handler]
// labelClassName           CSS styles for label <Col> [not rendered]

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
                if (props.handleSelect) {
                    props.handleSelect(facility);
                }
                break;
            }
        }
    }

    return (

        <SelectElement
          elementClassName={props.elementClassName ? props.elementClassName : null}
          fieldClassName={props.fieldClassName ? props.fieldClassName : null}
          fieldName="selectedFacility"
          fieldValue={facilityContext.selectedFacility.id}
          label="Current Facility:"
          labelClassName={props.labelClassName ? props.labelClassName : null}
          onChange={onChange}
          options={calculateOptions()}
        />

/*
            <div className="form-row">

                <div className="row form-group">

                    <label
                        className={labelClassName}
                        htmlFor="currentFacility"
                    >
                        Current Facility:
                    </label>

                    <select
                        id="currentFacility"
                        name="currentFacility"
                        onChange={onChange}
                        value={facilityContext.selectedFacility.id}
                    >
                        {facilityContext.facilities.map(facility => (
                            <option
                                key={facility.id}
                                value={facility.id}
                            >
                                {facility.name}
                            </option>
                        ))}
                    </select>

                </div>

            </div>
*/

    );

}

export default FacilitySelector;
