import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import SearchBar from "../library/components/SearchBar";

import * as FacilityClient from "../clients/FacilityClient";
import FacilityForm from "../forms/FacilityForm";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";
import TemplateForm from "../forms/TemplateForm";

// FacilityView --------------------------------------------------------------

// Top-level view for administering Facilities.

// Component Details ---------------------------------------------------------

const FacilityView = () => {

    const [facilities, setFacilities] = useState([]);
    const [facility, setFacility] = useState(null);
    const [index, setIndex] = useState(-1);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.info("FacilityView.useEffect()");
        retrieveAllFacilities();
    }, []);


    const emptyValues = () => {
        return {
            id: -1,
            active: true,
            address1: null,
            address2: null,
            city: null,
            email: null,
            name: null,
            phone: null,
            state: null,
            zipCode: null,

        }
    }

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("FacilityView.handleIndex(-1)");
            setFacility(null);
            setIndex(-1);
        } else {
            console.info("FacilityView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(facilities[newIndex], Replacers.FACILITY)
                + ")");
            setFacility(facilities[newIndex]);
            setIndex(newIndex);
        }
    }

    const handleInsert = (inserted) => {
        FacilityClient.insert(inserted)
            .then(response => {
                console.info("FacilityView.handleInsert("
                    + JSON.stringify(response.data, Replacers.FACILITY)
                    + ")");
                retrieveAllFacilities();
                setFacility(null);
                setIndex(-1);
                setSearchText("");
            })
            .catch(error => {
                reportError("FacilityView.handleInsert()", error);
            })
    }

    const handleRemove = (removed) => {
        FacilityClient.remove(removed.id)
            .then(response => {
                console.info("FacilityView.handleRemove("
                    + JSON.stringify(response.data, Replacers.FACILITY)
                    + ")");
                retrieveAllFacilities();
                setFacility(null);
                setIndex(-1);
                setSearchText("");
            })
            .catch(error => {
                reportError("FacilityView.handleRemove()", error);
            })
    }

    const handleUpdate = (updated) => {
        FacilityClient.update(updated.id, updated)
            .then(response => {
                console.info("FacilityView.handleUpdate("
                    + JSON.stringify(response.data, Replacers.TEMPLATE)
                    + ")");
                retrieveAllFacilities();
                setFacility(null);
                setIndex(-1);
                setSearchText("");
            })
            .catch(error => {
                reportError("FacilityView.handleUpdate()", error);
            })
    }

    const listFields = [
        "name",
        "active",
        "city",
        "state",
        "zipCode",
        "phone",
        "email",
    ];

    const listHeaders = [
        "Name",
        "Active",
        "City",
        "State",
        "Zip Code",
        "Phone Number",
        "Email Address",
    ];

    const onAdd = () => {
        console.info("FacilityView.onAdd()");
        setFacility(emptyValues());
        setIndex(-1);
    }

    const onBack = () => {
        console.info("FacilityView.onBack()");
        setFacility(null);
        setIndex(-1);
    }

    const onChange = (event) => {
        console.info("FacilityView.onChange(" + event.target.value + ")");
        setSearchText(event.target.value);
        retrieveFacilities(event.target.value);
    }

    const onClick = () => {
        console.info("FacilityView.onClick()");
        retrieveFacilities(searchText);
    }

    const retrieveAllFacilities = () => {
        FacilityClient.all()
            .then(response => {
                console.info("FacilityView.retrieveAllFacilities("
                    + JSON.stringify(response.data, Replacers.FACILITY)
                    + ")");
                setFacilities(response.data);
                setIndex(-1);
                setSearchText("");
            })
            .catch(error => {
                reportError("FacilityView.retrieveAllFacilities()", error);
            });
    }

    const retrieveFacilities = (newSearchText) => {
        if (newSearchText === "") {
            retrieveAllFacilities();
        } else {
            retrieveMatchingFacilities(newSearchText);
            setIndex(-1);
        }
    }

    const retrieveMatchingFacilities = (newSearchText) => {
        FacilityClient.name(newSearchText)
            .then(response => {
                console.info("FacilityView.retrieveMatchingFacilities("
                    + JSON.stringify(response.data, Replacers.FACILITY)
                    + ")");
                setFacilities(response.data);
                setIndex(-1);
            })
            .catch(error => {
                reportError("FacilityView.retrieveMatchingFacilities()", error);
            });
    }

    return (

        <>

            <Container fluid id="FacilityView">

                {(!facility) ? (

                    <>

                        {/* List View */}
                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="col-4">
                                <strong className="mr-3">CityTeam Facilities</strong>
                                <ActionButton
                                    label="Add"
                                    onClick={onAdd}
                                    variant="primary"
                                />
                            </Col>
                            <Col className="col-8">
                                <SearchBar
                                    fieldName="searchText"
                                    fieldValue={searchText}
                                    onChange={onChange}
                                    onClick={onClick}
                                    placeholder="Search by all or part of Facility name ..."
                                    // withAction
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1">
                            <List
                                bordered
                                fields={listFields}
                                // footer
                                handleIndex={handleIndex}
                                headers={listHeaders}
                                hover
                                index={index}
                                items={facilities}
                                striped
                                title={(searchText.length > 0 ? "Matching" : "All")
                                + " CityTeam Facilities"}
                            />
                        </Row>

                        <Row className="mb-2 ml-1 mr-1">
                            Click &nbsp;<strong>Add</strong>&nbsp; for a new Facility, or
                            click on a row in the table to edit an existing one.
                        </Row>

                    </>

                ) : null }

                {(facility) ? (

                    <>

                        {/* Form View */}
                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                <strong>
                                    <>
                                        {(facility.id < 0) ? (
                                            <span>Adding New</span>
                                        ) : (
                                            <span>Editing Existing</span>
                                        )}
                                        &nbsp;Facility
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
                            <Col className="col-sm-10">
                                <FacilityForm
                                    autoFocus={true}
                                    facility={facility}
                                    handleInsert={handleInsert}
                                    handleRemove={handleRemove}
                                    handleUpdate={handleUpdate}
                                    onConfirmNegative={onBack}
                                />
                            </Col>
                        </Row>

                    </>

                ) : null }

            </Container>

        </>

    )

}

export default FacilityView;
