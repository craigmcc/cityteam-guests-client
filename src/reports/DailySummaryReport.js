import React, { useContext, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
import ActionButton from "../library/components/ActionButton";
import DateSelector from "../library/components/DateSelector";
import List from "../library/components/List";
import * as Dates from "../library/util/Dates";
import { reportError } from "../util/error.handling";
import * as Replacers from "../util/Replacers";
import * as ReportTotals from "../util/ReportTotals";
import { withFlattenedObjects } from "../util/Transformations";

// DailySummaryReport --------------------------------------------------------

// Top-level view for Daily Summary Report.

// NOTE:  This is essentially equivalent to the third level of the
// Monthly Summary Report that is available for admins only.  Any
// changes here need to be reflected there, and vice versa.

// Component Details ---------------------------------------------------------

const DailySummaryReport = () => {

    const facilityContext = useContext(FacilityContext);

    const [selectedDate, setSelectedDate] = useState(Dates.today());

    const [detailsFields] = useState([
        "registrationDate",
        "matNumberAndFeatures",
        "guest.firstName",
        "guest.lastName",
        "paymentType",
        "paymentAmount",
        "showerTime",
        "wakeupTime",
        "comments",
    ]);
    const [detailsHeaders] = useState([
        "Date",
        "Mat",
        "First Name",
        "Last Name",
        "$$",
        "Amount",
        "Shower",
        "Wakeup",
        "Comments",
    ]);
//    const [detailsIndex, setDetailsIndex] = useState(-1);
//    const [detailsItem, setDetailsItem] = useState(null);
    const [detailsItems, setDetailsItems] = useState(null);
    const [detailsTitle, setDetailsTitle] = useState("");
    const [detailsTotals, setDetailsTotals] = useState({});
    const [detailsTotalsTitle, setDetailsTotalsTitle] = useState("");

    const flattenedRegistrations = (registrations) => {
        let flattenedItems =
            withFlattenedObjects(registrations, "guest");
        for (let flattenedItem of flattenedItems) {
            flattenedItem.matNumberAndFeatures = "" + flattenedItem.matNumber;
            if (flattenedItem.features) {
                flattenedItem.matNumberAndFeatures += flattenedItem.features;
            }
        }
        return flattenedItems;
    }

    const handleDetailsReport = (newDate) => {
        console.info("DailySummaryReport.handleDetailsReport(" + newDate + ")");
        setSelectedDate(newDate);
        FacilityClient.registrationDate(
            facilityContext.selectedFacility.id,
            newDate,
            { withGuest: "" }
        )
            .then(response => {
                let registrations = flattenedRegistrations(response.data);
                console.info("DailySummaryReport.handleDetailsReport("
                    + JSON.stringify(registrations, Replacers.REGISTRATION)
                    + ")");
//                setDetailsIndex(-1);
                setDetailsItems(registrations);
                setDetailsTitle("Daily Details for "
                    + facilityContext.selectedFacility.name
                    + " (" + newDate + ")");
                setDetailsTotals(ReportTotals.registrationsTotals(registrations));
                setDetailsTotalsTitle("Daily Totals for "
                    + facilityContext.selectedFacility.name
                    + " (" + newDate + ")");
            })
            .catch(error => {
                reportError("DailySummaryReport.handleDetailsReport()", error);
            })
    }

    const onBackDetails = () => {
        console.info("DailySummary.onBackDetails()");
//        setDetailsIndex(-1);
//        setDetailsItem(null);
        setDetailsItems(null);
    }

    return (

        <>

            <Container fluid id="DailySummaryReport">

                {(!detailsItems) ? (

                    <>

                        <Row className="mb-3">
                            <Col className="col-7">
                                <strong>Daily Summary for&nbsp;
                                    {facilityContext.selectedFacility.name}
                                </strong>
                            </Col>
                            <Col className="col-5">
                                <DateSelector
                                    action="Report"
                                    actionClassName="col-2"
                                    autoFocus={true}
                                    fieldClassName="col-7"
                                    fieldName="reportMonth"
                                    fieldValue={selectedDate}
                                    handleDate={handleDetailsReport}
                                    label="Report For:"
                                    labelClassName="col-3 text-right"
                                    placeholder="Enter YYYY-MM-DD"
                                    required
                                />
                            </Col>
                        </Row>

                    </>

                ) : null }


                {(detailsItems) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                Report Date:&nbsp;
                                {(new Date()).toLocaleString()}
                            </Col>
                            <Col className="text-right">
                                <ActionButton
                                    label="Back"
                                    onClick={onBackDetails}
                                    variant="primary"
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1 mb-3">
                            <List
                                bordered
                                fields={detailsFields}
                                footer
                                headers={detailsHeaders}
                                items={detailsItems}
                                striped
                                title={detailsTitle}
                            />
                        </Row>

                        <Row className="ml-1 mr-1 mt-4">
                            <List
                                bordered
                                fields={ReportTotals.registrationsFields}
                                headers={ReportTotals.registrationsHeaders}
                                items={[detailsTotals]}
                                title={detailsTotalsTitle}
                            />
                        </Row>

                    </>

                ) : null }

            </Container>

        </>

    )

}

export default DailySummaryReport;
