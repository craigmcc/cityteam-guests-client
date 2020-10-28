import React, { useContext, useEffect, useState } from "react";

import FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
import SelectElement from "../library/SelectElement";
import { reportError } from "../util/error.handling";

// TemplateSelector ----------------------------------------------------------

// Render a select list of the Templates defined for the currently selected
// Facility, along with optional label and action button elements.

// Incoming Properties -------------------------------------------------------

// action                   Button text for the action button [no action button]
// actionClassName          CSS styles for the action <Col> [col-2]
// actionVariant            Action button style variant [outline-info]
// elementClassName         CSS styles for the entire <Row> [col-12]
// fieldClassName           CSS styles for the select <Col> [col-8]
// fieldName                ID and name for this select [select]
// label                    Label text [no label]
// labelClassName           CSS styles for the label <Col> [col-2]
// onChange                 Handle (event) when select option changes [no handler]
// onClick                  Handle (template) when action button is pressed [no handler]

// Component Details ---------------------------------------------------------

export const TemplateSelector = (props) => {

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
        let newIndex = event.target.value;
        let newTemplate = templates[newIndex];
        console.info("TemplateSelector.onChange("
            + JSON.stringify(newTemplate, ["id", "name"])
            + ")");
        if (props.onChange) {
            props.onChange(newTemplate);
        }
        setIndex(newIndex)
    }

    const onClick = (event) => {
        let newTemplate = templates[index];
        console.info("TemplateSelector.onClick("
            + JSON.stringify(newTemplate, ["id", "name"])
            + ")");
        if (props.onClick) {
            props.onClick(newTemplate);
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
        FacilityClient.templateAll(facilityContext.selectedFacility.id)
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
            action={props.action ? props.action : "Select"}
            actionClassName="col-2"
            actionDisabled={index < 0}
            fieldClassName="col-8"
            fieldName="selectedTemplate"
            fieldValue={index}
            label="Select Template:"
            labelClassName="col-2"
            onChange={onChange}
            onClick={onClick}
            options={options}
        />




        /*
        <Container fluid>
            <Row>
                <label
                    className="mr-2"
                    htmlFor="currentTemplate"
                >
                    Use Template:
                </label>
                <select
                    className="mr-2"
                    id="currentTemplate"
                    name="currentTemplate"
                    onChange={handleChange}
                    value={(index >= 0) ? templates[index].id : -1}
                >
                    {templates.map(template => (
                        <option
                            key={template.id}
                            value={template.id}
                        >
                            {template.name}
                        </option>
                    ))}
                </select>
                <Button
                    onClick={handleClick}
                    size="sm"
                    variant="outline-info"
                >
                    {actionLabel}
                </Button>
            </Row>
        </Container>
*/

    );

}

export default TemplateSelector;
