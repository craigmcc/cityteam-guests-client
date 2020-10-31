import React, { useContext, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import FacilityClient from "../clients/FacilityClient";
import { FacilityContext } from "../contexts/FacilityContext";
import DateSelector from "../library/components/DateSelector";
import * as Months from "../library/util/Months";
import List from "../library/components/List";
import { reportError } from "../util/error.handling";
import { withFlattenedObjects } from "../util/transformations";
import MonthSelector from "../library/components/MonthSelector";

// MonthlySummaryReport ------------------------------------------------------

// Top-level view for Monthly Summary Report.

// TODO - summary totals at the bottom.

// Component Details ---------------------------------------------------------

const MonthlySummaryReport = () => {

    const facilityContext = useContext(FacilityContext);

    const [details, setDetails] = useState(null);
    const [headingSummaries, setHeadingSummaries] = useState("");
    const [headingSummary, setHeadingSummary] = useState("");
    const [indexDetails, setIndexDetails] = useState(-1);
    const [indexSummaries, setIndexSummaries] = useState(-1);
    const [selectedMonth, setSelectedMonth] = useState(Months.today());
    const [summaries, setSummaries] = useState(null);
    const [summary, setSummary] = useState(null);

    const handleReport = () => {
        console.info("MonthlySummaryReport.handleReport()");
        // TODO - handleReport extra?
    }

    const handleSelectedMonth = (newMonth, newValid) => {
        console.info("MonthlySummaryReport.handleSelectedMonth("
            + "month=" + newMonth
            + ", valid=" + newValid
            + ")");
        if (newValid) {
            setSelectedMonth(newMonth);
            // TODO - handleSelectedMonth extra stuff
        }
    }

    const onBackSummaries = () => {
        console.info("MonthlySummary.onBackSummaries()");
        setIndexSummaries(-1);
        setSummaries(null);
        setSummary(null);
    }

    const onBackSummary = () => {
        console.info("MonthlySummary.handleBackSummary()");
        setDetails(null);
        setIndexDetails(-1);
        setSummary(null);
    }

    return (

        <>

            <Container fluid id="MonthlySummaryReport">

                {(!summaries && !details) ? (

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
                                    fieldValue={Months.today()}
                                    handleMonth={handleSelectedMonth}
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

            </Container>

        </>

    )

}

export default MonthlySummaryReport;
