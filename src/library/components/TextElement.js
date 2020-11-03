import React from "react";
import Row from "react-bootstrap/Row";

import CommonAction from "./CommonAction";
import CommonLabel from "./CommonLabel";
import TextInput from "./TextInput";

// TextElement ---------------------------------------------------------------

// Renders up to three <Col> components, all within a single <Row>:
// - Element label (if "label" is provided), with optional "labelClassName" modifier
// - Text element itself (with "name" or default), with optional "fieldClassName" modifier
// - Action button (if "action" is provided), with optional "actionClassName" and "actionVariant"

// Incoming Properties -------------------------------------------------------

// autoFocus                Set automatic focus to this element on render [not set]
// action                   Action button text [no button is rendered]
// actionClassName          CSS styles for the action button <Col> element [not rendered]
// actionDisabled           Mark action button as disabled [not rendered]
// actionSize               Action button size ("lg", "sm") [sm]
// actionVariant            Action style variant [not rendered]
// elementClassName         CSS styles for overall <Row> component [not rendered]
// fieldClassName           CSS styles for the field <Col> element [col-9]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                Element name (for label mapping) [*REQUIRED*]
// fieldValue               Initially selected field value [not rendered]
// label                    Element label text [no label is rendered]
// labelClassName           CSS styles for the element label <Col> element [col-3]
// max                      Maximum allowed value [no restriction]
// maxLength                Maximum allowed number of characters [no restriction]
// min                      Minimum allowed value [no restriction]
// minLength                Minimum allowed number of characters [no restriction]
// onBlur                   Handle (event) for leaving input element [no handler]
// onChange                 Handle (event) for input element value change [no handler]
// onClick                  Handle (event) for action button click [no handler]
// onKeyDown                Handle (event) for key being pressed [no handler]
// pattern                  Matching regex pattern (see rules)
//                          for valid values [no restriction]
// placeholder              Placeholder expression when field is empty [not rendered]
// required                 Make this field required [no restriction]
// type                     Input element type (date, datetime-local, email, month,
//                          number, password, search, tel, text, time [text]
// withoutInputClassName    Leave off the default className on the input element

// Component Details ---------------------------------------------------------

const TextElement = (props) => {

    return (

        <Row
            className={props.elementClassName ? props.elementClassName : "mt-1 mb-2 col-12"}
        >
            <CommonLabel {...props}/>
            <TextInput {...props}/>
            <CommonAction {...props}/>
        </Row>

    )

}

export default TextElement;
