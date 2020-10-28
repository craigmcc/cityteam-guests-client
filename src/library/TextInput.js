import React from "react";
import Col from "react-bootstrap/Col";

// TextInput -----------------------------------------------------------------

// The <Col> for the input element shared by TextElement and TextField.

// Incoming Properties -------------------------------------------------------

// autoFocus                Set automatic focus to this element on render [not set]
// fieldClassName           CSS styles for the field <Col> element [col-9]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                Element name (for label mapping) [select]
// fieldValue               Initially selected field value [not rendered]
// max                      Maximum allowed value [no restriction]
// maxLength                Maximum allowed number of characters [no restriction]
// min                      Minimum allowed value [no restriction]
// minLength                Minimum allowed number of characters [no restriction]
// onBlur                   Handle (event) for leaving input element [no handler]
// onChange                 Handle (event) for input element value change [no handler]
// onKeyDown                Handle (event) for key being pressed [no handler]
// pattern                  Matching regex pattern (see rules)
//                          for valid values [no restriction]
// placeholder              Placeholder expression when field is empty [not rendered]
// required                 Make this field required [no restriction]
// type                     Input element type (date, datetime-local, email, month,
//                          number, password, search, tel, text, time [text]
// withoutInputClassName    Leave off the default className on the input element

// Component Details ---------------------------------------------------------

const TextInput = (props) => {

    return (

        <Col className={props.fieldClassName ? props.fieldClassName : "col-9"}>
            <input
                autoFocus={props.autoFocus ? props.autoFocus : null}
                className={props.withoutInputClassName ? null : "form-control"}
                disabled={props.fieldDisabled ? props.fieldDisabled : null}
                id={props.fieldName ? props.fieldName : "text"}
                max={props.max ? props.max : null}
                maxLength={props.maxLength ? props.maxLength : null}
                min={props.min ? props.min : null}
                minLength={props.minLength ? props.minLength: null}
                name={props.fieldName ? props.fieldName : "text"}
                onBlur={props.onBlur ? props.onBlur : null}
                onChange={props.onChange ? props.onChange : null}
                onKeyDown={props.onKeyDown ? props.onKeyDown : null}
                pattern={props.pattern ? props.pattern : null}
                placeholder={props.placeholder ? props.placeholder : null}
                required={props.required ? props.required : null}
                type={props.type ? props.type : "text"}
                value={props.fieldValue ? props.fieldValue : ""}
            />
        </Col>

    )

}

export default TextInput;
