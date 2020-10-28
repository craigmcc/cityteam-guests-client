import React from "react";
import Col from "react-bootstrap/Col";

// SelectInput ---------------------------------------------------------------

// The <Col> for the input element shared by SelectElement and SelectField.
// NOTES:
//   onBlur/onKeyDown/onChange need to be inherited from <Field> if in a form

// Incoming Properties -------------------------------------------------------

// autoFocus                Set automatic focus to this element on render [not set]
// fieldClassName           CSS styles for the field <Col> element [col-9]
// fieldDisabled            Mark input to this field as disabled [not disabled]
// fieldName                Element name (for label mapping) [*REQUIRED*]
// fieldValue               Initially selected field value [not rendered]
// onBlur                   Handle (event) for leaving input element [no handler]
// onChange                 Handle (event) for input element value change [no handler]
// onKeyDown                Handle (event) for key being pressed [no handler]
// options                  Array of options with "value" and "description fields
// withoutInputClassName    Leave off the default className on the input element

// Component Details ---------------------------------------------------------

const SelectInput = (props) => {

    return (

        <Col className={props.fieldClassName ? props.fieldClassName : "col-9"}>
            <select
                autoFocus={props.autoFocus ? props.autoFocus : null}
                className={props.withoutInputClassName ? null : "form-control"}
                disabled={props.fieldDisabled ? props.fieldDisabled : null}
                id={props.fieldName ? props.fieldName : "select"}
                name={props.fieldName ? props.fieldName : "select"}
                onBlur={props.onBlur ? props.onBlur : null}
                onChange={props.onChange ? props.onChange : null}
                onKeyDown={props.onKeyDown ? props.onKeyDown : null}
                value={props.fieldValue ? props.fieldValue : null}
            >
                {props.options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.description}
                    </option>
                ))}
            </select>
        </Col>

    )

}

export default SelectInput;
