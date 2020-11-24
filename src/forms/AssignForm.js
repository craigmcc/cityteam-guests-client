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
// - handleAssign will only be called when all validations pass.
// - Parent component can abandon a form with no complications.

// Incoming Properties -------------------------------------------------------

// assign                   Assign containing initial values to display
// autoFocus                Should we autoFocus on the first field?
// handleAssign             Handle (assign) after it is saved [*REQUIRED*]
// saveLabel                Label for the Save button [Save]

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
        "$$-Cash",
        "AG-Agency",
        "CT-CityTeam",
        "FM-Free Mat",
        "MM-Medical Mat",
        "SW-Severe Weather",
        "UK-Unknown",
        "WB-Work Bed",
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
                            validated="false"
                        >

                            <SelectElement
                                autoFocus={props.autoFocus}
                                fieldClassName="col-8"
                                fieldName="paymentType"
                                fieldValue={values.paymentType}
                                label="Pay Type:"
                                labelClassName="col-4"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                options={paymentOptions()}
                            />
                            <CommonError
                                errors={errors.paymentType}
                                fieldClassName="col-8"
                                labelClassName="col-4"
                                touched={touched.paymentType}
                            />

                            <TextElement
                                fieldClassName="col-8"
                                fieldName="paymentAmount"
                                fieldValue={values.paymentAmount}
                                label="Amount:"
                                labelClassName="col-4"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.paymentAmount}
                                fieldClassName="col-8"
                                labelClassName="col-4"
                                touched={touched.paymentAmount}
                            />

                            <TextElement
                                fieldClassName="col-8"
                                fieldName="showerTime"
                                fieldValue={values.showerTime}
                                label="Shower At:"
                                labelClassName="col-4"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.showerTime}
                                fieldClassName="col-8"
                                labelClassName="col-4"
                                touched={touched.showerTime}
                            />

                            <TextElement
                                fieldClassName="col-8"
                                fieldName="wakeupTime"
                                fieldValue={values.wakeupTime}
                                label="Wakeup At:"
                                labelClassName="col-4"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.wakeupTime}
                                fieldClassName="col-8"
                                labelClassName="col-4"
                                touched={touched.wakeupTime}
                            />

                            <TextElement
                                fieldClassName="col-8"
                                fieldName="comments"
                                fieldValue={values.comments}
                                label="Comments:"
                                labelClassName="col-4"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <CommonError
                                errors={errors.comments}
                                fieldClassName="col-8"
                                labelClassName="col-4"
                                touched={touched.comments}
                            />

                            <Row className="mt-3">
                                <Col className="col-4"/>
                                <Col className="col-8">
                                    <SaveButton
                                        disabled={isSubmitting || !isValid}
                                        label={props.saveLabel ? props.saveLabel : "Save"}
                                    />
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
