import React, { useContext, useEffect, useState } from "react";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
import SelectElement from "../library/components/SelectElement";
import { reportError } from "../util/error.handling";

// TemplateSelector ----------------------------------------------------------

// Render a select list of the Templates defined for the currently selected
// Facility, along with optional label and action button elements.

// Incoming Properties -------------------------------------------------------

// action                   Button text for action button [no action button]
// actionClassName          CSS styles for the action <Col> [col-2]
// actionDisabled           Mark action button as disabled [(index < 0)]
// actionSize               Action button size ("lg", "sm") [sm]
// actionVariant            Action button style variant [outline-info]
// autoFocus                Should this field receive autoFocus? [false]
// elementClassName         CSS styles for the entire <Row> [not rendered]
// fieldClassName           CSS styles for the select <Col> [col-8]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                ID and name for this select [selectedTemplate]
// handleTemplate           Handle valid (template) on change or click [no handler]
// label                    Label text [no label]
// labelClassName           CSS styles for the label <Col> [col-2]
// options                  Array of (Template) for available options [*REQUIRED*]

// Component Details ---------------------------------------------------------

const TemplateSelector = (props) => {

    const facilityContext = useContext(FacilityContext);

    const [index, setIndex] = useState(-1);
    const [options, setOptions] = useState([]);
    const [templates, setTemplates] = useState([]);

    useEffect( () => {
        retrieveAllItems();
        // eslint-disable-next-line
    }, [facilityContext.selectedFacility]);

    const calculateOptions = (newTemplates) => {
        let results = [];
        results.push({ value: -1, description: "(Select)"});
        newTemplates.forEach((newTemplate, thisIndex) => {
            results.push({ value: thisIndex, description: newTemplate.name});
        });
        return results;
    }

    const onChange = (event) => {
        let newIndex = Number(event.target.value);
        let newTemplate = templates[newIndex];
        console.info("TemplateSelector.onChange("
            + JSON.stringify(newTemplate, ["id", "name"])
            + ")");
        if (props.handleTemplate && !props.action && (newIndex >= 0)) {
            props.handleTemplate(newTemplate);
        }
        setIndex(newIndex)
    }

    const onClick = () => {
        let newTemplate = templates[index];
        console.info("TemplateSelector.onClick("
            + JSON.stringify(newTemplate, ["id", "name"])
            + ")");
        if (props.handleTemplate && (index >= 0)) {
            props.handleTemplate(newTemplate);
        }
        setIndex(-1);
        setOptions([]);
        setTemplates([]);
    }

    const retrieveAllItems = () => {
        if (!facilityContext.selectedFacility || facilityContext.selectedFacility.id < 1) {
            setIndex(-1);
            setOptions(calculateOptions([]));
            setTemplates([]);
            return;
        }
        console.log("TemplateSelector.retrieveAllItems for("
            + JSON.stringify(facilityContext.selectedFacility, ["id", "name"])
            + ")");
        FacilityClient.templateAll(
            facilityContext.selectedFacility.id
        )
            .then(response => {
                console.log("TemplateSelector.retrieveAllItems got("
                    + JSON.stringify(response.data, ["id", "name"])
                    + ")");
                setIndex(-1);
                setOptions(calculateOptions(response.data));
                setTemplates(response.data);
            })
            .catch(err => {
                reportError("TemplateSelector.retrieveAllItems()", err);
            });
    }

    return (

        <SelectElement
            action={props.action ? props.action : null}
            actionClassName={props.actionClassName ? props.actionClassName : "col-2"}
            actionDisabled={props.actionDisabled ? props.actionDisabled : index < 0}
            actionSize={props.actionSize ? props.actionSize : null}
            actionVariant={props.actionVariant ? props.actionVariant : "outline-primary"}
            autoFocus={props.autoFocus ? props.autoFocus : null}
            elementClassName={props.elementClassName ? props.elemenClassName : null}
            fieldClassName={props.fieldClassName ? props.fieldClassName : "col-8"}
            fieldDisabled={props.fieldDisabled ? props.fieldDisabled : null}
            fieldName={props.fieldName ? props.fieldName : "selectedTemplate"}
            fieldValue={index}
            label={props.label ? props.label : "Select Template:"}
            labelClassName={props.labelClassName ? props.labelClassName : "col-2"}
            onChange={onChange}
            onClick={onClick}
            options={options}
        />

    );

}

export default TemplateSelector;
