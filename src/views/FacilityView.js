import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";

// FacilityView --------------------------------------------------------------

// Top-level view for administering Facilities.

// Component Details ---------------------------------------------------------

const FacilityView = () => {

    useEffect(() => {
        console.info("FacilityView.useEffect()");
    });

    return (

        <>

            <Container fluid>

                <div>
                    This is FacilityView.
                </div>

            </Container>
        </>

    )

}

export default FacilityView;
