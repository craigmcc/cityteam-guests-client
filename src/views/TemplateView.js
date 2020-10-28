import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";

// TemplateView --------------------------------------------------------------

// Top-level view for administering Templates.

// Component Details ---------------------------------------------------------

const TemplateView = () => {

    useEffect(() => {
        console.info("TemplateView.useEffect()");
    });

    return (

        <>

            <Container fluid>

                <div>
                    This is TemplateView.
                </div>

            </Container>
        </>

    )

}

export default TemplateView;
