import React, { useState } from "react";

import TextElement from "./TextElement";
import * as Validations from "./Validations";

// MonthSelector -------------------------------------------------------------

// Render a text element to enter a month.  On up-to-date browsers like Chrome,
// this will utilize the browser's extended input capabilities.  For other
// browsers, it will fall back to accepting and processing YYYY-MM strings.

// Incoming Properties -------------------------------------------------------

// action                   Button text for the action button [no action button]
// actionClassName          CSS styles for action <Col> [col-2]
// actionDisabled           Mark action button as disabled [(!fieldValid)]
// actionSize               Action button size ("lg", "sm") [sm]
// actionVariant            Action button style variant [outline-info]
// autoFocus                Should this field receive autoFocus? [false]
// elementClassName         CSS styles for overall <Row> [not rendered]
// fieldClassName           CSS styles for field <Col> [col-8]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                ID and name for this input [selectedMonth]
// fieldValue               Initial field value [""]
// handleMonth              Handle valid (month) as text on change or click [no handler]
// label                    Label text [no label]
// labelClassName           CSS styles for label <Col> [col-2]
// max                      Maximum acceptable value [no max]
// min                      Minimum acceptable value [no min]
// placeholder              Placeholder when field is empty [not rendered]
// required                 Make this field required [no restriction]

const MonthSelector = (props) => {

    const [fieldValid, setFieldValid] = useState(true);
    const [fieldValue, setFieldValue] =
        useState(props.fieldValue ? props.fieldValue : "");

    const alertMessage = (newFieldValue) => {
        let message = "Invalid month specifier, must be in format YYYY-MM";
        if (props.max && (newFieldValue > props.max)) {
            message += ", < " + props.max;
        }
        if (props.min && (newFieldValue < props.min)) {
            message += ", > " + props.min;
        }
        if (props.required) {
            message += ", required";
        }
        return message;
    }

    const onChange = (event) => {
        let newFieldValue = event.target.value;
        let newFieldValid = Validations.validateDate(newFieldValue);
        if (newFieldValue === "") {
            if (props.required) {
                newFieldValid = false;
            }
        } else {
            if (props.max && (newFieldValue > props.max)) {
                newFieldValue = false;
            }
            if (props.min && (newFieldValue < props.min)) {
                newFieldValue = false;
            }
        }
        if (props.required && (newFieldValue === "")) {
            newFieldValid = false;
        }
        console.info("MonthSelector.onChange("
            + "value=" + newFieldValue
            + ", valid=" + newFieldValid
            + ")");
        setFieldValid(newFieldValid);
        setFieldValue(newFieldValue);
        if (newFieldValid) {
            if (props.handleMonth && !props.action) {
                props.handleMonth(newFieldValue);
            }
        } else {
            alert(alertMessage(newFieldValue));
        }
    }

    const onClick = (event) => {
        console.info("DateSelector.onClick("
            + "value=" + fieldValue
            + ", valid=" + fieldValid
            + ")");
        if (fieldValid) {
            if (props.handleDate) {
                props.handleDate(fieldValue);
            }
        } else {
            alert(alertMessage(fieldValue));
        }
    }

    return (

        <TextElement
            action={props.action ? props.action : null}
            actionClassName={props.actionClassName ? props.actionClassName : "col-2"}
            actionDisabled={props.actionDisabled ? props.actionDisabled : !fieldValid}
            actionSize={props.actionSize ? props.actionSize : null}
            actionVariant={props.actionVariant ? props.actionVariant : "outline-primary"}
            autoFocus={props.autoFocus ? props.autoFocus : null}
            elementClassName={props.elementClassName ? props.elemenClassName : null}
            fieldClassName={props.fieldClassName ? props.fieldClassName : "col-8"}
            fieldDisabled={props.fieldDisabled ? props.fieldDisabled : null}
            fieldName={props.fieldName ? props.fieldName : "selectedMonth"}
            fieldValue={fieldValue}
            label={props.label ? props.label : null}
            labelClassName={props.labelClassName ? props.labelClassName : "col-2"}
            max={props.max ? props.max : null}
            min={props.min ? props.min : null}
            onChange={onChange}
            onClick={onClick}
            pattern={Validations.validateMonthPattern}
            placeholder={props.placeholder ? props.placeholder : "Enter YYYY-MM-DD"}
            required={props.required ? props.required : null}
            type="month"
        />

    );

}

export default MonthSelector;
