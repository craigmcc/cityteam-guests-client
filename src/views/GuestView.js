import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";

// GuestView -----------------------------------------------------------------

// Top-level view for administering Guests.

// Component Details ---------------------------------------------------------

const GuestView = () => {

    useEffect(() => {
        console.info("GuestView.useEffect()");
    });

    return (

        <>

            <Container fluid>

                <div>
                    This is GuestView.
                </div>

            </Container>
        </>

    )

}

export default GuestView;
