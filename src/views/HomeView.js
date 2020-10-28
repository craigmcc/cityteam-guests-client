import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";

// HomeView ------------------------------------------------------------------

// Top-level view for entering the application.

// Component Details ---------------------------------------------------------

const HomeView = () => {

    useEffect(() => {
        console.info("HomeView.useEffect()");
    });

    return (

        <>

            <Container fluid>

                <div>
                    This is the really basic HomeView.
                </div>

            </Container>
        </>

    )

}

export default HomeView;
