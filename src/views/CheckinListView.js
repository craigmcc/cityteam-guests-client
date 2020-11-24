import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import List from "../library/components/List";

import * as FacilityClient from "../clients/FacilityClient";
import * as TemplateClient from "../clients/TemplateClient";
import TemplateSelector from "../components/TemplateSelector";
import { FacilityContext } from "../contexts/FacilityContext";
import * as Replacers from "../util/Replacers";
import * as ReportTotals from "../util/ReportTotals";
import * as Transformations from "../util/Transformations";
import { reportError } from "../util/error.handling";

// CheckinListView -----------------------------------------------------------

// Second-level view for checkins, listing all current Registrations for
// the selected date.

// Incoming Properties -------------------------------------------------------

// handleRegistration       Handle (registration) when selected
//                          (will receive null when unselected) [no handler]
// selectedDate             Date for which to list registrations
//                          (will offer to generate if none) [*REQUIRED*]

// Component Details ---------------------------------------------------------

const CheckinListView = (props) => {

    const facilityContext = useContext(FacilityContext);

    const [detailsTotals, setDetailsTotals] = useState({});
    const [detailsTotalsTitle, setDetailsTotalsTitle] = useState("");
    const [index, setIndex] = useState(-1);
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        retrieveRegistrations(props.selectedDate);
        // eslint-disable-next-line
    }, [facilityContext.selectedFacility, props.selectedDate]);

    const flattenedRegistrations = (registrations) => {
        let flattenedItems =
            Transformations.withFlattenedObjects(registrations, "guest");
        for (let flattenedItem of flattenedItems) {
            flattenedItem.matNumberAndFeatures = "" + flattenedItem.matNumber;
            if (flattenedItem.features) {
                flattenedItem.matNumberAndFeatures += flattenedItem.features;
            }
        }
        return flattenedItems;
    }

    const handleGenerate = (template) => {
        console.info("CheckinListView.handleGenerate for ("
            + JSON.stringify(template, Replacers.TEMPLATE)
            + ")");
        TemplateClient.generate(
            template.id,
            props.selectedDate
        )
            .then(response => {
                let newRegistrations = flattenedRegistrations(response.data);
                console.info("CheckinListView.handleGenerate got ("
                    + JSON.stringify(newRegistrations.data, Replacers.REGISTRATION)
                    + ")");
                setIndex(-1);
                setRegistrations(newRegistrations);
            })
            .catch(error => {
                reportError("CheckinListView.handleGenerate()", error);
            })
    }

    const handleIndex = (newIndex) => {
        if (newIndex === index) {
            console.info("CheckinListView.handleIndex(-1)");
            setIndex(-1);
            if (props.handleRegistration) {
                props.handleRegistration(null);
            }
        } else {
            console.info("CheckinListView.handleIndex("
                + newIndex + ", "
                + JSON.stringify(registrations[newIndex], Replacers.REGISTRATION)
                + ")");
            setIndex(newIndex);
            if (props.handleRegistration) {
                props.handleRegistration(registrations[newIndex]);
            }
        }
    }

    const listFields = [
        "matNumberAndFeatures",
        "guest.firstName",
        "guest.lastName",
        "paymentType",
        "paymentAmount",
        "showerTime",
        "wakeupTime",
        "comments",
    ];

    const listHeaders = [
        "Mat",
        "First Name",
        "Last Name",
        "$$",
        "Amount",
        "Shower",
        "Wakeup",
        "Comments",
    ];

    const retrieveRegistrations = (newSelectedDate) => {
        if (facilityContext.selectedFacility.id <= 0) {
            setIndex(-1);
            setRegistrations([]);
            return;
        }
        FacilityClient.registrationDate(
            facilityContext.selectedFacility.id,
            newSelectedDate,
            { withGuest: "" }
        )
            .then(response => {
                let newRegistrations = flattenedRegistrations(response.data);
                console.info("CheckinListView.retrieveRegistrations("
                    + JSON.stringify(newRegistrations, Replacers.REGISTRATION)
                    + ")");
                setIndex(-1);
                setRegistrations(newRegistrations);
                setDetailsTotals(ReportTotals.registrationsTotals(newRegistrations));
                setDetailsTotalsTitle("In-Progress Totals for "
                    + facilityContext.selectedFacility.name
                    + " (" + newSelectedDate + ")");
            })
            .catch(error => {
                reportError("CheckinListView.retrieveRegistrations()", error);
            });
    }

    return (

        <Container fluid>

            { (facilityContext.selectedFacility) && (registrations.length === 0) ? (
                <Row className="mb-3 ml-1">
                    <TemplateSelector
                        action="Generate"
                        fieldName="selectedTemplate"
                        handleTemplate={handleGenerate}
                        label="Select Template"
                    />
                </Row>
            ) : (
                <span/>
            )}

            <Row className="ml-1 mr-1 mb-3">
                <Col>
                    <List
                        bordered
                        fields={listFields}
                        footer
                        handleIndex={handleIndex}
                        headers={listHeaders}
                        hover
                        index={index}
                        items={registrations}
                        striped
                    />
                </Col>
            </Row>

            <Row className="ml-3 mr-3">
                <List
                    bordered
                    fields={ReportTotals.registrationsFields}
                    headers={ReportTotals.registrationsHeaders}
                    items={[detailsTotals]}
                    title={detailsTotalsTitle}
                />
            </Row>

            <Row className="mb-3 ml-3 mr-3">
                Click on a row to create a new assignment, or manage an existing
                assignment, for that mat.
            </Row>

        </Container>

    )

}

export default CheckinListView;
