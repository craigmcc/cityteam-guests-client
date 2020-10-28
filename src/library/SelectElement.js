import React from "react";
import Row from "react-bootstrap/Row";

import CommonAction from "./CommonAction";
import CommonLabel from "./CommonLabel";
import SelectInput from "./SelectInput";

// SelectElement -------------------------------------------------------------

// Renders up to three <Col> components, all within a single <Row>:
// - Element label (if "label" is provided), with optional "labelClassName" modifier
// - Select element itself (with "name" or default), with optional "fieldClassName" modifier
// - Action button (if "action" is provided), with optional "actionClassName" and "actionVariant"

// Incoming Properties -------------------------------------------------------

// autoFocus                Set automatic focus to this element on render [not set]
// action                   Action button text [no button is rendered]
// actionClassName          CSS styles for the action button <Col> element [not rendered]
// actionDisabled           Mark action button as disabled [not rendered]
// actionSize               Action button size ("lg", "sm") [sm]
// elementClassName         CSS styles for overall <Row> component [not rendered]
// fieldClassName           CSS styles for the field element <Col> element [not rendered]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                Element name (for label mapping) [select]
// fieldValue               Initially selected field value [not rendered]
// label                    Element label text [no label is rendered]
// labelClassName           CSS styles for the element label <Col> element [not rendered]
// onBlur                   Handle (event) for leaving input element [no handler]
// onChange                 Handle (event) for input element value change [no handler]
// onClick                  Handle (event) for action button click [no handler]
// options                  Array of options with "value" and "description fields
// withoutInputClassName    Leave off the default className on the input element

// Component Details ---------------------------------------------------------

const SelectElement = (props) => {

    return (

        <Row
            className={props.elementClassName ? props.elementClassName : "mt-1 mb-1 col-12"}
        >
            <CommonLabel {...props}/>
            <SelectInput {...props}/>
            <CommonAction {...props}/>
        </Row>
    )

}

export default SelectElement;
