import React from "react";

import ActionButton from "./ActionButton";

// Pagination ----------------------------------------------------------------

// Very simple pagination controls.

// WARNING:  Likely to be modified a bunch.

// Incoming Properties -------------------------------------------------------

// currentPage              One-relative current page number [1]
// lastPage                 Is this the last page? [false]
// onNext                   Handle () for "Next" control being clicked [no handler]
// onPrevious               Handle () for "Previous" control being clicked [no handler]
// size                     Size of these buttons (lg, sm) [sm]
// variant                  Variant style of these buttons [outline-secondary]

// Component Details ---------------------------------------------------------

const Pagination = (props) => {

    return (
        <>
            <ActionButton
                disabled={props.currentPage === 1}
                label="&lt;"
                onClick={props.onPrevious ? props.onPrevious : null}
                size={props.size ? props.size : null}
                variant={props.variant ? props.variant : "outline-secondary"}
            />
            <ActionButton
                disabled
                label={props.currentPage}
                size={props.size ? props.size : null}
            />
            <ActionButton
                disabled={props.lastPage}
                label="&gt;"
                onClick={props.onNext ? props.onNext : null}
                size={props.size ? props.size : null}
                variant={props.variant ? props.variant : "outline-secondary"}
            />
        </>
    )

}

export default Pagination;
