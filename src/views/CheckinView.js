import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import DateSelector from "../library/components/DateSelector";
import * as Dates from "../library/util/Dates";

import CheckinAssignedView from "./CheckinAssignedView";
import CheckinListView from "./CheckinListView";
//import CheckinUnassignedView from "./CheckinUnassignedView";
import { FacilityContext } from "../contexts/FacilityContext";
import * as Replacers from "../util/Replacers";

// CheckinView ---------------------------------------------------------------

// Top-level view for checking in overnight guests.

// The "stage" state is used to pick which view (if any) to display for
// detailed processing.  Valid values are "None", "List",
// "Assigned", or "Unassigned".

// Component Details ---------------------------------------------------------

const CheckinView = () => {

    const facilityContext = useContext(FacilityContext);

    const [registration, setRegistration] = useState({}); // TODO - null?
    const [selectedDate, setSelectedDate] = useState(Dates.today());
    const [stage, setStage] = useState("None");

    useEffect(() => {
        console.info("CheckinView.useEffect()");
    })

    const handleRegistration = (newRegistration) => {
        console.info("CheckinView.handleRegistration("
            + JSON.stringify(newRegistration, Replacers.REGISTRATION)
            + ")");
        setRegistration(newRegistration);
        if (newRegistration.guestId) {
            setStage("Assigned");
        } else {
            setStage("Unassigned");
        }
    }

    const handleSelectedDate = (newSelectedDate) => {
        console.info("CheckinView.handleSelectedDate(" +
            newSelectedDate + ")");
        setSelectedDate(newSelectedDate);
        setStage("List");
    }

    const handleStage = (newStage) => {
        console.info("CheckinView.handleStage(" + newStage + ")");
        setStage(newStage);
    }

    return (

        <>

            {/* Top View (always visible) */}
            <Container fluid id="CheckinView">
                <Row className="mt-3 mb-3 mr-2">
                    <Col className="col-7">
                        <strong>Checkins for&nbsp;
                            {facilityContext.selectedFacility.name}</strong>
                    </Col>
                    <Col className="col-5">
                        <DateSelector
                            action="Checkins"
                            actionClassName="col-2"
                            autoFocus={true}
                            fieldClassName="col-6"
                            fieldName="checkinDate"
                            fieldValue={selectedDate}
                            handleDate={handleSelectedDate}
                            label="Checkin Date:"
                            labelClassName="col-4 text-right"
                            placeholder="Enter YYYY-MM-DD"
                            required
                        />
                    </Col>
                </Row>
            </Container>

            {(stage === "Assigned") ? (
                <CheckinAssignedView
                    handleStage={handleStage}
                    registration={registration}
                />
            ) : null}

            {(stage === "List") ? (
                <CheckinListView
                    handleRegistration={handleRegistration}
                    selectedDate={selectedDate}
                />
            ) : null}

{/*
            {(stage === "Unassigned") ? (
                <CheckinUnassignedView
                    handleStage={handleStage}
                    registration={registration}
                />
            ) : null}
*/}

        </>

    )

}

export default CheckinView;
