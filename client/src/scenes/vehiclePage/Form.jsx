import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as yup from 'yup';
import {
    Box, Button, TextField, Checkbox, FormControlLabel, Typography, Grid,
    Radio, RadioGroup, FormControl, FormLabel, MenuItem, InputLabel, Select, Input
} from '@mui/material';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useNavigate } from "react-router-dom";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Form validation schema
// Please add the actual validation logic based on your requirements
const vehicleRequisitionSchema = yup.object().shape({
    indenterName: yup.string().required('Indenter name is required'),
    phoneNo: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
    travelers: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Name is required'),
            mobileNo: yup.string().matches(/^\d{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required')
        })
    ).min(1, 'At least one traveler is required'),
    typeOfVehicle: yup.string().required('Type of vehicle is required'),
    busType: yup.string().when('typeOfVehicle', {
        is: 'bus',
        then: yup.string().required('Bus type is required')
    }),
    busSeats: yup.string().when('typeOfVehicle', {
        is: 'bus',
        then: yup.string().required('Number of seats is required')
    }),
    journeyDate: yup.date().required('Journey date is required'),
    from: yup.string().required('From location is required'),
    others: yup.string(),
    fromDetail: yup.string().required('From detail is required'),
    to: yup.string().required('To location is required'),
    reportingTime: yup.string().required('Reporting time is required'),
    returnDate: yup.date().required('Return date is required'),
    returnFrom: yup.string().required('From destination is required'),
    returnOthers: yup.string(),
    returnFromDetail: yup.string().required('Return from detail is required'),
    returnTo: yup.string().required('To destination is required'),
    returnReportingTime: yup.string().required('Return reporting time is required'),
    officialTrip: yup.boolean(),
    chargedToProject: yup.string(),
    chargeType: yup.string(),
    purposeOfTrip: yup.string().required('Purpose of trip is required'),
    indenterSignature: yup.mixed().required('All Signatures are Required'),
    headSignature: yup.mixed().required('All Signatures are Required'),
});

const initialValues = {
    indenterName: '',
    phoneNo: '',
    travelers: [{ name: '', mobileNo: '' }],
    typeOfVehicle: '',
    busType: '',
    busSeats: '',
    journeyDate: '',
    from: '',
    others: '',
    fromDetail: '',
    to: '',
    reportingTime: '',
    returnDate: '',
    returnFrom: '',
    returnOthers: '',
    returnFromDetail: '',
    returnTo: '',
    returnReportingTime: '',
    officialTrip: false,
    chargedToProject: '',
    chargeType: '',
    purposeOfTrip: '',
    indenterSignature: null,
    headSignature: null,
};
export default function VehicleRequisitionForm() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (values, { setSubmitting }) => {
        setLoading(true);
        generatePDF(values).then(() => {
        }).catch(error => {
            alert('Error in form submission');
            setSubmitting(false);
            setLoading(false);
        });
    };
    const handleFileUpload = (event, setFieldValue, fieldName) => {
        const file = event.currentTarget.files[0];
        setFieldValue(fieldName, file);
    };
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    const generatePDF = async (values) => {
        try {
            const createRow = (title, data) => [{ text: title, style: 'tableHeader' }, data];
            const createSectionTitle = (title) => [{ text: title, style: 'sectionTitle', colSpan: 2, alignment: 'left' }, {}];
            const indenterSignatureBase64 = await convertFileToBase64(values.indenterSignature);
            const headSignatureBase64 = await convertFileToBase64(values.headSignature);

            let tableBody = [
                createSectionTitle('Indenter Details'),
                createRow('Name of Indenter', `${values.indenterName}`),
                createRow('Phone No', `${values.phoneNo}`),

                createSectionTitle('Traveler Details'),
                createRow('Name of Persons Travelling', {
                    ul: values.travelers.map(traveler => `${traveler.name}, Mobile No.: ${traveler.mobileNo}`)
                }),
                createRow('No. of persons Travelling', `${values.travelers.length}`),

                createSectionTitle('Vehicle Details'),
                createRow('Type of Vehicle', `${values.typeOfVehicle}`),
                // Conditional Bus details
                ...(values.typeOfVehicle.toLowerCase() === 'bus' ? [
                    createRow('Bus Type', `${values.busType}`),
                    createRow('Bus Seats', `${values.busSeats}`)
                ] : []),

                createSectionTitle('Journey Details'),
                createRow('Date of Journey', `${values.journeyDate}`),
                createRow('From', `${values.from} (Flight/Train No.: ${values.fromDetail})`),
                createRow('Other Destinations', `${values.others}`),
                createRow('To', `${values.to}`),
                createRow('Reporting Time', `${values.reportingTime}`),
                createSectionTitle('Return Journey Details'),
                createRow('Return Date of Journey', `${values.returnDate}`),
                createRow('Return From', `${values.returnFrom} (Flight/Train No.: ${values.returnFromDetail})`),
                createRow('Other Destinations', `${values.returnOthers}`),
                createRow('Return To', `${values.returnTo}`),
                createRow('Return Reporting Time', `${values.returnReportingTime}`),

                createSectionTitle('Trip Details'),
                createRow('This Trip may be treated as', `Official: ${values.officialTrip ? 'Yes' : 'No'}, Charged to Project: ${values.chargedToProject}, Project Type: ${values.chargeType}`),
                createRow('Purpose of trip', `${values.purposeOfTrip}`),

                createSectionTitle('Signatures'),
                createRow('Signature of Indenter', { image: indenterSignatureBase64, width: 150, height: 50 }),
                createRow('Signature of Head of Discipline/Section/Unit/Registrar/Dean-GA', { image: headSignatureBase64, width: 150, height: 50 })
            ];

            const docDefinition = {
                content: [
                    { text: 'Vehicle Requisition Form', style: 'header' },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: tableBody
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 0, 0, 20]
                    },
                    sectionTitle: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableHeader: {
                        bold: true,
                        color: 'black'
                    },
                    normal: {
                        fontSize: 12,
                        margin: [0, 2]
                    },
                    signature: {
                        width: 150,
                        height: 50,
                        alignment: 'center',
                        margin: [0, 10, 0, 10]
                    }
                },
            };

            pdfMake.createPdf(docDefinition).download('vehicle_requisition_form.pdf');
            pdfMake.createPdf(docDefinition).getBuffer(async (buffer) => {
                let blob = new Blob([buffer], {type: 'application/pdf'});

                // Convert Blob to Base64
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    base64data = base64data.split(',')[1]; // Split to get only the Base64 content
                    sendEmail(base64data); // Call sendEmail with Base64 string
                }
            });
        } catch(err) {
            console.log(err);
            alert("Error generating PDF, please try again");
            setLoading(false);
        }

    };
    const sendEmail = async (pdfBase64) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pdfBlob: pdfBase64 })
            });
            const res = await response.json();
            if (response.ok) {
                alert("Email Sent Successfully to Mr. Shailesh Patani  (Mob No) 9904473885, Email: sjpatani@iitgn.ac.in");
                setLoading(false);
                navigate('/home');
            } else {
                alert('Error sending email');
                console.log(res.message);
                setLoading(false);
            }
        } catch (error) {
            console.error('Network error:', error.message);
            alert("Error sending email, please try again later");
            setLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={vehicleRequisitionSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting, handleBlur }) => (
                <Form id="vehicleRequisitionForm">
                    <Grid container spacing={2} alignItems="center">
                        {/* Indenter's Details */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Indenter's Details</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="indenterName"
                                name="indenterName"
                                label="Name of Indenter"
                                value={values.indenterName}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.indenterName && Boolean(errors.indenterName)}
                                helperText={touched.indenterName && errors.indenterName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="phoneNo"
                                name="phoneNo"
                                label="Phone No"
                                value={values.phoneNo}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.phoneNo && Boolean(errors.phoneNo)}
                                helperText={touched.phoneNo && errors.phoneNo}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Traveller's Details</Typography>
                        </Grid>
                        <FieldArray
                            name="travelers"
                            render={arrayHelpers => (
                                <React.Fragment>
                                    {values.travelers.map((traveler, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    name={`travelers.${index}.name`}
                                                    label={`Traveler #${index + 1} Name`}
                                                    value={traveler.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}  // Add onBlur to update touched
                                                    error={touched.name && Boolean(errors.name)}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    name={`travelers.${index}.mobileNo`}
                                                    label="Mobile No"
                                                    value={traveler.mobileNo}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}  // Add onBlur to update touched
                                                    error={touched.mobileNo && Boolean(errors.mobileNo)}
                                                    helperText={touched.mobileNo && errors.mobileNo}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                    <Grid item xs={12}>
                                        <Button
                                            type="button"
                                            onClick={() => arrayHelpers.push({ name: '', mobileNo: '' })}
                                        >
                                            Add Traveler
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => arrayHelpers.pop()}
                                        >
                                            Remove Traveler
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            )}
                        />

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Vehicle Details</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="typeOfVehicle-label">Type of Vehicle</InputLabel>
                                <Select
                                    labelId="typeOfVehicle-label"
                                    id="typeOfVehicle"
                                    name="typeOfVehicle"
                                    value={values.typeOfVehicle}
                                    label="Type of Vehicle"
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.typeOfVehicle && Boolean(errors.typeOfVehicle)}
                                    helperText={touched.typeOfVehicle && errors.typeOfVehicle}
                                >
                                    <MenuItem value="Sedan">Sedan</MenuItem>
                                    <MenuItem value="SUV">SUV</MenuItem>
                                    <MenuItem value="Bus">Bus</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {values.typeOfVehicle === 'Bus' && (
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Bus Type</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-label="busType"
                                            name="busType"
                                            value={values.busType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.busType && Boolean(errors.busType)}
                                            helperText={touched.busType && errors.busType}
                                        >
                                            <FormControlLabel value="AC" control={<Radio />} label="AC" />
                                            <FormControlLabel value="Non-AC" control={<Radio />} label="Non-AC" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="busSeats-label">Number of Seats</InputLabel>
                                        <Select
                                            labelId="busSeats-label"
                                            id="busSeats"
                                            name="busSeats"
                                            value={values.busSeats}
                                            label="Number of Seats"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.busSeats && Boolean(errors.busSeats)}
                                            helperText={touched.busSeats && errors.busSeats}
                                        >
                                            <MenuItem value={17}>17</MenuItem>
                                            <MenuItem value={29}>29</MenuItem>
                                            <MenuItem value={41}>41</MenuItem>
                                            <MenuItem value={56}>56</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </React.Fragment>
                        )}

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Journey Details</Typography>
                        </Grid>

                        {/* Journey Date */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                id="journeyDate"
                                name="journeyDate"
                                label="Date of Journey"
                                InputLabelProps={{ shrink: true }}
                                value={values.journeyDate}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.journeyDate && Boolean(errors.journeyDate)}
                                helperText={touched.journeyDate && errors.journeyDate}
                            />
                        </Grid>

                        {/* From */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="from-label">From</InputLabel>
                                <Select
                                    labelId="from-label"
                                    id="from"
                                    name="from"
                                    value={values.from}
                                    label="From"
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.from && Boolean(errors.from)}
                                    helperText={touched.from && errors.from}
                                >
                                    <MenuItem value="Airport">Airport</MenuItem>
                                    <MenuItem value="RailwayStation">Railway Station</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {values.from === "Airport" && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="fromDetail"
                                    name="fromDetail"
                                    label="Flight No."
                                    value={values.fromDetail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.fromDetail && Boolean(errors.fromDetail)}
                                    helperText={touched.fromDetail && errors.fromDetail}
                                />
                            </Grid>
                        )}
                        {values.from === "RailwayStation" && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="fromDetail"
                                    name="fromDetail"
                                    label="Train No."
                                    value={values.fromDetail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.fromDetail && Boolean(errors.fromDetail)}
                                    helperText={touched.fromDetail && errors.fromDetail}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="others"
                                name="others"
                                label="Other Destinations"
                                value={values.others}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.others && Boolean(errors.others)}
                                helperText={touched.others && errors.others}
                            />
                        </Grid>

                        {/* To */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="to"
                                name="to"
                                label="To"
                                value={values.to}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.to && Boolean(errors.to)}
                                helperText={touched.to && errors.to}
                            />
                        </Grid>

                        {/* Reporting Time */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="time"
                                id="reportingTime"
                                name="reportingTime"
                                label="Reporting Time"
                                InputLabelProps={{ shrink: true }}
                                value={values.reportingTime}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.reportingTime && Boolean(errors.reportingTime)}
                                helperText={touched.reportingTime && errors.reportingTime}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Return Journey Details</Typography>
                        </Grid>

                        {/* Journey Date */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                id="returnDate"
                                name="returnDate"
                                label="Date of Return Journey"
                                InputLabelProps={{ shrink: true }}
                                value={values.returnDate}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.returnDate && Boolean(errors.returnDate)}
                                helperText={touched.returnDate && errors.returnDate}
                            />
                        </Grid>

                        {/* From */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="from-label">From</InputLabel>
                                <Select
                                    labelId="from-label"
                                    id="returnFrom"
                                    name="returnFrom"
                                    value={values.returnFrom}
                                    label="Return From"
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.returnFrom && Boolean(errors.returnFrom)}
                                    helperText={touched.returnFrom && errors.returnFrom}
                                >
                                    <MenuItem value="Airport">Airport</MenuItem>
                                    <MenuItem value="RailwayStation">Railway Station</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {values.returnFrom === "Airport" && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="returnFromDetail"
                                    name="returnFromDetail"
                                    label="Flight No."
                                    value={values.returnFromDetail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.returnFromDetail && Boolean(errors.returnFromDetail)}
                                    helperText={touched.returnFromDetail && errors.returnFromDetail}
                                />
                            </Grid>
                        )}
                        {values.returnFrom === "RailwayStation" && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="returnFromDetail"
                                    name="returnFromDetail"
                                    label="Train No."
                                    value={values.returnFromDetail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}  // Add onBlur to update touched
                                    error={touched.returnFromDetail && Boolean(errors.returnFromDetail)}
                                    helperText={touched.returnFromDetail && errors.returnFromDetail}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="returnOthers"
                                name="returnOthers"
                                label="Other Destinations"
                                value={values.returnOthers}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.returnOthers && Boolean(errors.returnOthers)}
                                helperText={touched.returnOthers && errors.returnOthers}
                            />
                        </Grid>

                        {/* To */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="returnTo"
                                name="returnTo"
                                label="To"
                                value={values.returnTo}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.returnTo && Boolean(errors.returnTo)}
                                helperText={touched.returnTo && errors.returnTo}
                            />
                        </Grid>

                        {/* Reporting Time */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="time"
                                id="returnReportingTime"
                                name="returnReportingTime"
                                label="Reporting Time"
                                InputLabelProps={{ shrink: true }}
                                value={values.returnReportingTime}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.returnReportingTime && Boolean(errors.returnReportingTime)}
                                helperText={touched.returnReportingTime && errors.returnReportingTime}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Trip Classification</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="officialTrip"
                                        checked={values.officialTrip}
                                        onChange={handleChange}
                                        onBlur={handleBlur}  // Add onBlur to update touched
                                        error={touched.officialTrip && Boolean(errors.officialTrip)}
                                        helperText={touched.officialTrip && errors.officialTrip}
                                    />
                                }
                                label="This trip may be treated as official"
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="chargedToProject"
                                name="chargedToProject"
                                label="Charged to Project (Project Number)"
                                value={values.chargedToProject}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.chargedToProject && Boolean(errors.chargedToProject)}
                                helperText={touched.chargedToProject && errors.chargedToProject}
                            />
                        </Grid>

                        {/* CPDA and PDA */}
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel id="pd-type">Charge Type</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="pd-type"
                                    name="chargeType"
                                    value={values.chargeType}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel
                                        value="CPDA"
                                        control={<Radio />}
                                        label="CPDA"
                                    />
                                    <FormControlLabel
                                        value="PDA"
                                        control={<Radio />}
                                        label="PDA"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {/* Purpose of Trip */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="purposeOfTrip"
                                name="purposeOfTrip"
                                label="Purpose of Trip"
                                value={values.purposeOfTrip}
                                onChange={handleChange}
                                onBlur={handleBlur}  // Add onBlur to update touched
                                error={touched.purposeOfTrip && Boolean(errors.purposeOfTrip)}
                                helperText={touched.purposeOfTrip && errors.purposeOfTrip}
                                multiline
                                rows={4}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Authorization</Typography>
                        </Grid>
                        {/* Signature Fields */}
                        <Grid item xs={12}>
                            <InputLabel htmlFor="indenterSignature">Indenter's Signature</InputLabel>
                            <Input
                                id="indenterSignature"
                                name="indenterSignature"
                                type="file"
                                onChange={(event) => handleFileUpload(event, setFieldValue, 'indenterSignature')}
                                onBlur={handleBlur}
                                error={touched.indenterSignature && Boolean(errors.indenterSignature)}
                                helperText={touched.indenterSignature && errors.indenterSignature}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="headSignature">Head's Signature</InputLabel>
                            <Input
                                id="headSignature"
                                name="headSignature"
                                type="file"
                                onChange={(event) => handleFileUpload(event, setFieldValue, 'headSignature')}
                                onBlur={handleBlur}
                                error={touched.headSignature && Boolean(errors.headSignature)}
                                helperText={touched.headSignature && errors.headSignature}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}
