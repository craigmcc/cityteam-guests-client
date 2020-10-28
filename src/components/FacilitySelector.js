import React, { useContext, useState } from "react";

import { FacilityContext } from "../contexts/FacilityContext";

// props.handleSelect Handle (facility) that was just selected [No handler]
// props.labelClassName CSS styles for label [default for text]
export const FacilitySelector = (props) => {

    const facilityContext = useContext(FacilityContext);
    const [labelClassName] =
        useState(props.labelClassName
            ? "mr-3 " + props.labelClassName
            : "mr-3");

    const onChange = (event) => {
        let newId = Number(event.target.value);
        for (let facility of facilityContext.facilities) {
            if (facility.id === newId) {
                console.log("FacilitySelector.onChange(" +
                    JSON.stringify(facility, ["id", "name"]) + ")");
                facilityContext.setSelectedFacility(facility);
                if (props.handleSelect) {
                    props.handleSelect(facility);
                }
                break;
            }
        }
    }

    return (

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

    );

}

export default FacilitySelector;
