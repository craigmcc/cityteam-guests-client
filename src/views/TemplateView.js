import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";

import * as FacilityClient from "../clients/FacilityClient";
import * as TemplateClient from "../clients/TemplateClient";
import { FacilityContext } from "../contexts/FacilityContext";
import TemplateForm from "../forms/TemplateForm";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";

// TemplateView --------------------------------------------------------------

// Top-level view for administering Templates.

// Component Details ---------------------------------------------------------

const TemplateView = () => {

    const facilityContext = useContext(FacilityContext);

    const [index, setIndex] = useState(-1);
    const [template, setTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        console.info("TemplateView.useEffect()");
        retrieveAllTemplates();
        // eslint-disable-next-line
    }, [facilityContext.selectedFacility]);

    const emptyValues = () => {
        return {
            id: -1,
            active: true,
            allMats: null,
            comments: null,
            facilityId: null,
            handicapMats: null,
            name: null,
            socketMats: null
        }
    }

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("TemplateView.handleIndex(-1)");
            setIndex(-1);
            setTemplate(null);
        } else {
            console.info("TemplateView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(templates[newIndex], Replacers.TEMPLATE)
                + ")");
            setIndex(newIndex);
            setTemplate(templates[newIndex]);
        }
    }

    const handleInsert = (inserted) => {
        inserted.facilityId = facilityContext.selectedFacility.id;
        TemplateClient.insert(inserted)
            .then(response => {
                console.info("TemplateView.handleInsert("
                    + JSON.stringify(response, Replacers.TEMPLATE)
                    + ")");
                retrieveAllTemplates();
                setIndex(-1);
                setTemplate(null);
            })
            .catch(error => {
                reportError("TemplateView.insert()", error);
            })
    }

    const handleRemove = (removed) => {
        removed.facilityId = facilityContext.selectedFacility.id;
        TemplateClient.remove(removed.id)
            .then(response => {
                console.info("TemplateView.handleRemove("
                    + JSON.stringify(response, Replacers.TEMPLATE)
                    + ")");
                retrieveAllTemplates();
                setIndex(-1);
                setTemplate(null);
            })
            .catch(error => {
                reportError("TemplateView.remove()", error);
            })
    }

    const handleUpdate = (updated) => {
        updated.facilityId = facilityContext.selectedFacility.id;
        TemplateClient.update(updated.id, updated)
            .then(response => {
                console.info("TemplateView.handleUpdate("
                    + JSON.stringify(response, Replacers.TEMPLATE)
                    + ")");
                retrieveAllTemplates();
                setIndex(-1);
                setTemplate(null);
            })
            .catch(error => {
                reportError("TemplateView.update()", error);
            })
    }

    const listFields = [
        "name",
        "active",
        "comments",
        "allMats",
        "handicapMats",
        "socketMats"
    ];

    const listHeaders= [
        "Name",
        "Active",
        "Comments",
        "All Mats",
        "Handicap Mats",
        "Socket Mats"
    ];

    const onAdd = () => {
        console.info("TemplateView.onAdd()");
        setIndex(-1);
        setTemplate(emptyValues());
    }

    const onBack = () => {
        console.info("TemplateView.onBack()");
        setIndex(-1);
        setTemplate(null);
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
                setTemplate(null);
                setTemplates(response.data);
            })
            .catch(error => {
                reportError("TemplateView.retrieveAllTemplates()", error);
            })
    }

    return (

        <>

            <Container fluid id="TemplateView">

                {(!template) ? (

                        <>

                            {/* List View */}
                            <Row className="ml-1 mr-1 mb-3">
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
                                    fields={listFields}
                                    handleIndex={handleIndex}
                                    headers={listHeaders}
                                    hover
                                    index={index}
                                    items={templates}
                                    striped
                                    title={"All Templates for "
                                    + facilityContext.selectedFacility.name}
                                />
                            </Row>

                            <Row className="mb-1 ml-1 mr-1">
                                Click &nbsp;<strong>Add</strong>&nbsp; for a new Template, or
                                click on a row in the table to edit an existing one.
                            </Row>

                        </>

                    ) : null }

                {(template) ? (

                    <>

                        {/* Form View */}
                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                    <strong>
                                        <>
                                            {(template.id < 0) ? (
                                                <span>Adding New</span>
                                            ) : (
                                                <span>Editing Existing</span>
                                            )}
                                            &nbsp;Template for {facilityContext.selectedFacility.name}
                                        </>
                                    </strong>
                            </Col>
                            <Col className="text-right">
                                <ActionButton
                                    label="Back"
                                    onClick={onBack}
                                    variant="primary"
                                />
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="col-sm-9">
                                <TemplateForm
                                    autoFocus={true}
                                    handleInsert={handleInsert}
                                    handleRemove={handleRemove}
                                    handleUpdate={handleUpdate}
                                    template={template}
                                />
                            </Col>
                        </Row>

                    </>

                ) : null }

            </Container>

        </>

    )

}

export default TemplateView;
