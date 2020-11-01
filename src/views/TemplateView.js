import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

// import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
// import TemplateForm from "../forms/TemplateForm";
import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";

// TemplateView --------------------------------------------------------------

// Top-level view for administering Templates.

// Component Details ---------------------------------------------------------

const TemplateView = () => {

    const facilityContext = useContext(FacilityContext);

    const [index, setIndex] = useState(-1);
    const [show, setShow] = useState(false);
    const [template, setTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        console.info("TemplateView.useEffect()");
        retrieveAllTemplates();
        // eslint-disable-next-line
    }, [facilityContext.selectedFacility]);

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("TemplateView.handleIndex(-1)");
            setIndex(-1);
            setShow(false);
            setTemplate(null);
        } else {
            console.info("TemplateView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(templates[newIndex], Replacers.TEMPLATE)
                + ")");
            setIndex(newIndex);
            setShow(true);
            setTemplate(templates[newIndex]);
        }
    }

    const handleInsert = (template) => {
        console.info("TemplateView.handleInsert("
            + JSON.stringify(template, Replacers.TEMPLATE)
            + ")");
        setShow(false);
        retrieveAllTemplates();
    }

    const handleRemove = (template) => {
        console.info("TemplateView.handleRemove("
            + JSON.stringify(template, Replacers.TEMPLATE)
            + ")");
        setShow(false);
        retrieveAllTemplates();
    }

    const handleUpdate = (template) => {
        console.info("TemplateView.handleUpdate("
            + JSON.stringify(template, Replacers.TEMPLATE)
            + ")");
        setShow(false);
        retrieveAllTemplates();
    }

    const onAdd = () => {
        console.info("TemplateView.onAdd()");
        setTemplate(null);
        setShow(true);
    }

    const onHide = () => {
        console.info("TemplateView.onHide()");
        setIndex(-1);
        setShow(false);
    }

    const retrieveAllTemplates = () => {
        if (facilityContext.selectedFacility.id <= 0) {
            setTemplates([]);
            return;
        }
        console.info("TemplateView.retrieveAllTemplates for("
            + JSON.stringify(facilityContext.selectedFacility, Replacers.FACILITY)
            + ")");
        FacilityClient.templateAll(
            facilityContext.selectedFacility.id
        )
            .then(response => {
                console.info("TemplateView.retrieveAllTemplates got("
                    + JSON.stringify(response.data, Replacers.TEMPLATE)
                    + ")");
                setIndex(-1);
                setTemplates(response.data);
            })
            .catch(error => {
                reportError("TemplateView.retrieveAllTemplates()", error);
            })
    }

    // TODO - skip modals for now
    return (

        <>

            <Container fluid id="TemplateView">

                <Row className="mb-3">
                    <Col>
                        <strong className="mr-3">
                            Templates for {facilityContext.selectedFacility.name}
                        </strong>
                        <ActionButton
                            label="Add"
                            onClick={onAdd}
                            variant="primary"
                        />
                    </Col>
                </Row>

                <Row className="ml-1 mr-1">
                    <List
                        bordered
                        fields={["name", "active", "allMats",
                                 "handicapMats", "socketMats"]}
                        handleIndex={handleIndex}
                        headers={["Name", "Active", "All Mats",
                                  "Handicap Mats", "Socket Mats"]}
                        hover
                        index={index}
                        items={templates}
                        striped
                        title={"All Templates for "
                               + facilityContext.selectedFacility.name}
                    />
                </Row>

                <Row className="mb-1 ml-1 mr-1">
                    Click &nbsp;<strong>Add</strong>&nbsp; for a new Facility, or
                    click on a row in the table to edit an existing one.
                </Row>

            </Container>

        </>

    )

}

export default TemplateView;
