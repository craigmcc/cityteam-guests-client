import React from "react";

import TextElement from "../library/TextElement";

// SearchBar -----------------------------------------------------------------

// Render a search bar with specified placeholder and icon, with optional
// clear and button controls.  The entire search bar will be encapsulated
// in a <Row> element, with optionally specified CSS characteristics.

// Incoming Properties -------------------------------------------------------

// action                   If withAction specified, button text [🔍]
// actionClassName          If withAction specified, CSS styles for action <Col> [col-1]
// actionVariant            If withAction specified, button variant [light]
// elementClassName         CSS styles for the entire <Row> [col-12]
// fieldClassName           CSS styles for the input <Col> [col-11]
// fieldName                ID and name for this input [search]
// fieldValue               Initially rendered search text [not rendered]
// onChange                 Handle (event) when search text changes [no handler]
// onClick                  Handle (event) when Enter pressed or
//                          action button clicked [no handler]
// withAction               Render an action button, and obey actionXxx props [no action button]
// TODO - no way to get a withClear button inside the TextElement's <Row>

// Component Details ---------------------------------------------------------

const SearchBar = (props) => {

    const onChange = (event) => {
        console.info("SearchBar.onChange(" + event.target.value + ")");
        if (props.onChange) {
            props.onChange(event);
        }
    }

    /*
        const onClear = () => {
            console.info("SearchBar.onClear()");
            if (props.onChange) {
                props.onChange({target: { value: "" }});
            }
        }
    */

    const onClick = () => {
        console.info("SearchBar.onClick()");
        if (props.onClick) {
            props.onClick();
        }
    }

    const onKeyDown = (event) => {
        if (event.key === "Enter") {
            console.info("SearchBar.onKeyDown()");
            if (props.onClick) {
                props.onClick(event);
            }
        }
    }

    return (

        <TextElement
            action={props.withAction ? (props.action ? props.action : "🔍") : null}
            actionClassName={props.actionClassName ? props.actionClassName : "col-1"}
            actionVariant={props.actionVariant ? props.actionVariant : "light"}
            elementClassName={props.elementClassName ? props.elementClassName : "col-12"}
            fieldClassName={props.fieldClassName ? props.fieldClassName : "col-11"}
            fieldName={props.fieldName ? props.fieldName : "search"}
            fieldValue={props.fieldValue ? props.fieldValue : null}
            label={props.label ? props.label : null}
            labelClassName={props.labelClassName ? props.labelClassName : null}
            onChange={onChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
            placeholder={props.placeholder ? props.placeholder : "Search ..."}
        />

    )

}

export default SearchBar;
