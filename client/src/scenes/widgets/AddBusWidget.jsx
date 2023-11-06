import { useState } from "react";
import {
    Box,
    Button,
    TextField, Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import FlexBetween from "../../components/FlexBetween";
import QRCode from "react-qr-code";
import WidgetWrapper from "../../components/WidgetWrapper";

const busRegisterSchema = yup.object().shape({
    busName: yup.string().required("required"),
    capacity: yup.string().required("required")
});

const initialValues = {
    busName: "",
    capacity: ""
};


const AddBusWidget = () => {
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading,setIsLoading] = useState(false);
    const dark = palette.neutral.dark;
    const handleFormSubmit = async (values, onSubmitProps) => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3001/bus/create`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const res = await response.json();
            alert(res.message);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <WidgetWrapper>
                <FlexBetween>
                    <Typography color={dark} variant="h3" fontWeight="500">
                        Add New Bus
                    </Typography>
                </FlexBetween>
                <br/>
                <br/>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={busRegisterSchema}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          setFieldValue,
                          resetForm,
                      }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <TextField
                                    label="Bus Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="busName"
                                    error={
                                        Boolean(touched.busName) && Boolean(errors.busName)
                                    }
                                    helperText={touched.busName && errors.busName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Capacity"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="capacity"
                                    error={
                                        Boolean(touched.capacity) && Boolean(errors.capacity)
                                    }
                                    helperText={touched.capacity && errors.capacity}
                                    sx={{ gridColumn: "span 2" }}
                                />
                            </Box>
                            <Box>
                                <Button
                                    fullWidth
                                    type="submit"
                                    sx={{
                                        m: "2rem 0",
                                        p: "1rem",
                                        backgroundColor: palette.primary.main,
                                        color: palette.background.alt,
                                        "&:hover": { color: palette.primary.main },
                                    }}
                                >
                                    {loading?"Loading....":"ADD BUS"}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </WidgetWrapper>

        </>
    );
};

export default AddBusWidget;