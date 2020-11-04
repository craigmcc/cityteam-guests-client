import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import CommonError from "../library/components/CommonError";
import SaveButton from "../library/components/SaveButton";
import SelectElement from "../library/components/SelectElement";
import TextElement from "../library/components/TextElement";
import * as Validations from "../library/util/Validations";

import * as Replacers from "../util/Replacers";
import * as Transformations from "../util/Transformations";

// AssignForm ----------------------------------------------------------------

// Input form for editing Registration assignments to Guests
// (with Formik-based validation).

// TODO - move the actual database transaction back to the caller.

// NOTES:
// - handleAssign will only be called when all validations pass,
//   and the database transaction has already occurred.  (This latter
//   part might change in the future.)
// - Parent component can abandon a form with no complications.

// Incoming Properties -------------------------------------------------------

// assign                   Assign containing initial values to display
// autoFocus                Should we autoFocus on the first field?
// handleAssign             Handle (assign) after it is saved [*REQUIRED*]

// Component Details ---------------------------------------------------------

const AssignForm = (props) => {

    const [initialValues] = useState(Transformations.toEmptyStrings(props.assign));

    const handleAssign = (assigned) => {
        console.info("AssignForm.handleAssign("
            + JSON.stringify(assigned, Replacers.REGISTRATION)
            + ")");
        if (props.handleAssign) {
            props.handleAssign(Transformations.toNullValues(assigned));
        } else {
            alert("AssignForm: Programming error, no handleAssign defined, "
                + "so no assign is possible.");
        }
    }

    const handleSubmit = (values, actions) => {
        actions.setSubmitting(true);
        handleAssign(values);
        actions.setSubmitting(false);
    }

    const paymentOptions = () => {
        let results = [];
        validatePaymentTypes.forEach(paymentType => {
            results.push({
                value: paymentType.substr(0, 2),
                description: paymentType
            })});
        return results;
    }

    const validationSchema = () => {
        return Yup.object().shape({
            paymentType: Yup.string(), // Implicitly required via select options
            paymentAmount: Yup.number(),
            showerTime: Yup.string()
                .test("valid-shower-time",
                    "Invalid Shower Time format, must be 99:99 or 99:99:99",
                    (value) => Validations.validateTime(value)),
            wakeupTime: Yup.string()
                .test("valid-wakeup-time",
                    "Invalid Wakeup Time format, must be 99:99 or 99:99:99",
                    (value) => Validations.validateTime(value)),
            comments: Yup.string()
        })
    }

// First two characters of each option are the value to be checked
    const validatePaymentTypes = [
        "$$ - Cash",
        "AG - Agency",
        "CT - CityTeam",
        "FM - Free Mat",
        "MM - Medical Mat",
        "SW - Severe Weather",
        "UK - Unknown"
    ]

    return (

        <>

            {/* Details Form */}
            <Container fluid id="AssignForm">

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        handleSubmit(values, actions);
                    }}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >
                    {( {
                           errors,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           isValid,
                           touched,
                           values,
                    }) => (
                        <Form
                            className="mx-auto"
                            noValidate
                            onSubmit={handleSubmit}
                            validated={false}
                        >


                            <Row>

                                <Col className="col-7">

                                    <SelectElement
                                        autoFocus={props.autoFocus}
                                        fieldClassName="col-7"
                                        fieldName="paymentType"
                                        fieldValue={values.paymentType}
                                        label="Pay Type:"
                                        labelClassName="col-5"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        options={paymentOptions()}
                                    />
                                    <CommonError
                                        errors={errors.paymentType}
                                        touched={touched.paymentType}
                                    />

                                </Col>

                                <Col className="col-5">

                                    <TextElement
                                        fieldClassName="col-6"
                                        fieldName="paymentAmount"
                                        fieldValue={values.paymentAmount}
                                        label="Amount:"
                                        labelClassName="col-6"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    <CommonError
                                        errors={errors.paymentAmount}
                                        touched={touched.paymentAmount}
                                    />

                                </Col>

                            </Row>

                            <Row>

                                <Col className="col-7">

                                    <TextElement
                                        fieldClassName="col-6"
                                        fieldName="showerTime"
                                        fieldValue={values.showerTime}
                                        label="Shower:"
                                        labelClassName="col-6"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    <CommonError
                                        errors={errors.showerAt}
                                        touched={touched.showerAt}
                                    />

                                </Col>

                                <Col className="col-5">

                                    <TextElement
                                        fieldClassName="col-6"
                                        fieldName="wakeupTime"
                                        fieldValue={values.wakeupTime}
                                        label="Wakeup:"
                                        labelClassName="col-6"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    <CommonError
                                        errors={errors.wakeupAt}
                                        touched={touched.wakeupAt}
                                    />

                                </Col>

                            </Row>

                            <TextElement
                                fieldName="comments"
                                fieldValue={values.comments}
                                label="Comments:"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.comments}
                                touched={touched.comments}
                            />

                            <Row className="mt-3">
                                <Col className="col-3"/>
                                <Col className="col-9">
                                    <SaveButton
                                        disabled={isSubmitting || !isValid}/>
                                </Col>
                            </Row>

                        </Form>
                    )}
                </Formik>

            </Container>

        </>

    )

}

export default AssignForm;
