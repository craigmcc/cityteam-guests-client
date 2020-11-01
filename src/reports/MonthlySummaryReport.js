import React, { useContext, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import * as FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
import ActionButton from "../library/components/ActionButton";
import List from "../library/components/List";
import MonthSelector from "../library/components/MonthSelector";
import * as Months from "../library/util/Months";
import { reportError } from "../util/error.handling";
import * as ReportTotals from "../util/ReportTotals";
import { withFlattenedObjects } from "../util/transformations";

// MonthlySummaryReport ------------------------------------------------------

// Top-level view for Monthly Summary Report.

// Component Details ---------------------------------------------------------

const MonthlySummaryReport = () => {

    const facilityContext = useContext(FacilityContext);

    const [selectedMonth, setSelectedMonth] = useState(Months.today());

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

    const [summariesFields] = useState([
        "registrationDate",
        "total$$",
        "totalAG",
        "totalCT",
        "totalFM",
        "totalMM",
        "totalSW",
        "totalUK",
        "totalAssigned",
        "percentAssigned",
        "totalUnassigned",
        "percentUnassigned",
        "totalMats",
        "totalAmount",
    ]);
    const [summariesHeaders] = useState([
        "Date",
        "$$",
        "AG",
        "CT",
        "FM",
        "MM",
        "SW",
        "UK",
        "Used",
        "%Used",
        "Empty",
        "%Empty",
        "Total Mats",
        "Total $$",
    ]);
    const [summariesIndex, setSummariesIndex] = useState(-1);
//    const [summariesItem, setSummariesItem] = useState(null);
    const [summariesItems, setSummariesItems] = useState(null);
    const [summariesTitle, setSummariesTitle] = useState("");
    const [summariesTotals, setSummariesTotals] = useState({});
    const [summariesTotalsTitle, setSummariesTotalsTitle] = useState("");

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

    const handleSummariesIndex = (newIndex) => {
        if (newIndex === summariesIndex) {
            console.info("MonthlySummaryReort.handleSummariesIndex(-1)");
            setSummariesIndex(-1);
//            setSummariesItem(null);
        } else {
            setSummariesIndex(newIndex);
//            setSummariesItem(summariesItems[newIndex]);
            FacilityClient.registrationDate(
                facilityContext.selectedFacility.id,
                summariesItems[newIndex].registrationDate,
                   { withGuest: "" }
            )
                .then(response => {
                    let registrations = flattenedRegistrations(response.data);
                    console.info("MonthlySummaryReport.handleSummariesIndex("
                        + newIndex
                        + ", " + JSON.stringify(registrations,
                            ["id", "registrationDate", "matNumberAndFeatures"])
                        + ")");
//                    setDetailsIndex(-1);
                    setDetailsItems(registrations);
                    setDetailsTitle("Daily Details for "
                        + facilityContext.selectedFacility.name
                        + " (" + summariesItems[newIndex].registrationDate + ")");
                    setDetailsTotals(ReportTotals.registrationsTotals(registrations));
                    setDetailsTotalsTitle("Daily Totals for "
                        + facilityContext.selectedFacility.name
                        + " (" + summariesItems[newIndex].registrationDate + ")");
                })
                .catch(err => {
                    reportError("MonthlySummaryReport.handleItemsSummaries()", err);
                })
        }
    }

    const handleSummariesReport = (newMonth, newValid) => {
        console.info("MonthlySummaryReport.handleSummariesReport("
            + "month=" + newMonth
            + ", valid=" + newValid
            + ")");
        if (newValid) {
            setSelectedMonth(newMonth);
            let registrationDateFrom = Months.startDate(newMonth);
            let registrationDateTo = Months.endDate(newMonth);
            FacilityClient.registrationSummary(facilityContext.selectedFacility.id,
                registrationDateFrom, registrationDateTo)
                .then(response => {
                    console.info("MonthlySummaryReport.handleSummariesReport("
                        + JSON.stringify(response.data, ["facilityId", "registrationDate", "totalAssigned"])
                        + ")"
                    );
                    response.data.forEach(summary => {
                        summary.totalMats = summary.totalAssigned + summary.totalUnassigned;
                        if (summary.totalMats === 0) {
                            summary.percentAssigned = "0.0%";
                            summary.percentUnassigned = "0.0%";
                        } else {
                            summary.percentAssigned =
                                "" + (summary.totalAssigned * 100 / summary.totalMats).toFixed(1) + "%";
                            summary.percentUnassigned =
                                "" + (summary.totalUnassigned * 100 / summary.totalMats).toFixed(1) + "%";
                        }
                        summary.totalAmount = "$" + parseFloat(summary.totalAmount).toFixed(2);
                    })
                    setSummariesIndex(-1);
//                    setSummariesItem(null);
                    setSummariesItems(response.data);
                    setSummariesTitle("Monthly Summary for "
                        + facilityContext.selectedFacility.name
                        + " (" + registrationDateFrom
                        + " - " + registrationDateTo + ")"
                    )
                    setSummariesTotals(ReportTotals.summariesTotals(response.data));
                    setSummariesTotalsTitle("Monthly Totals for "
                        + facilityContext.selectedFacility.name
                        + " (" + registrationDateFrom
                        + " - " + registrationDateTo + ")"
                    )
                })
                .catch(error => {
                    reportError("MonthlySummaryReport.handleReportSummaries()", error);
                })
        } else {
            // Ignore any invalid selected month (being edited on fallback)
        }
    }

    const onBackDetails = () => {
        console.info("MonthlySummary.onBackDetails()");
//        setDetailsIndex(-1);
//        setDetailsItem(null);
        setDetailsItems(null);
    }

    const onBackSummaries = () => {
        console.info("MonthlySummary.handleBackSummaries()");
        setSummariesIndex(-1);
//        setSummariesItem(null);
        setSummariesItems(null);
    }

    return (

        <>

            <Container fluid id="MonthlySummaryReport">

                {(!summariesItems && !detailsItems) ? (

                    <>

                        <Row className="mb-3">
                            <Col className="col-7">
                                <strong>Monthly Summary for&nbsp;
                                    {facilityContext.selectedFacility.name}
                                </strong>
                            </Col>
                            <Col className="col-5">
                                <MonthSelector
                                    action="Report"
                                    actionClassName="col-2"
                                    autoFocus={true}
                                    fieldClassName="col-7"
                                    fieldName="reportMonth"
                                    fieldValue={selectedMonth}
                                    handleMonth={handleSummariesReport}
                                    label="Report For:"
                                    labelClassName="col-3 text-right"
//                                    max="2020-11"
                                    min="2020-01"
                                    placeholder="Enter YYYY-MM"
                                    required
                                />
                            </Col>
                        </Row>

                    </>

                ) : null }

                {(summariesItems && !detailsItems) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                Report Date:&nbsp;
                                {(new Date()).toLocaleString()}
                            </Col>
                            <Col className="text-right">
                                <ActionButton
                                    label="Back"
                                    onClick={onBackSummaries}
                                    variant="primary"
                                />
                            </Col>
                        </Row>

                        <Row className="ml-1 mr-1 mb-3">
                            <List
                                bordered
                                fields={summariesFields}
                                footer
                                handleIndex={handleSummariesIndex}
                                headers={summariesHeaders}
                                hover
                                index={summariesIndex}
                                items={summariesItems}
                                striped
                                title={summariesTitle}
                            />
                        </Row>

                        <Row className="ml-1 mr-1">
                            Click on a row to display details for that date.
                        </Row>

                        <Row className="ml-1 mr-1 mt-4">
                            <List
                                bordered
                                fields={ReportTotals.summariesFields}
                                headers={ReportTotals.summariesHeaders}
                                items={[summariesTotals]}
                                title={summariesTotalsTitle}
                            />
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

export default MonthlySummaryReport;
