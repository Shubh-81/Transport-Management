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
import WidgetWrapper from "../../components/WidgetWrapper";

const announcementSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    message: yup.string().required("Announcement message is required")
});

const initialValues = {
    title: "",
    message: ""
};

const AddAnnouncementWidget = () => {
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (values, onSubmitProps) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/announcement/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const res = await response.json();
            alert(res.message);
            setLoading(false);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <WidgetWrapper>
                <Typography variant="h3" fontWeight="500" color={palette.neutral.dark}>
                    Add New Announcement
                </Typography>
                <br/>
                <br/>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={announcementSchema}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
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
                                    label="Title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    name="title"
                                    error={Boolean(touched.title) && Boolean(errors.title)}
                                    helperText={touched.title && errors.title}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Announcement"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.message}
                                    name="message"
                                    error={Boolean(touched.message) && Boolean(errors.message)}
                                    helperText={touched.message && errors.message}
                                    multiline
                                    rows={4}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>
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
                                {loading ? "Loading..." : "ADD ANNOUNCEMENT"}
                            </Button>
                        </form>
                    )}
                </Formik>
            </WidgetWrapper>
        </>
    );
};

export default AddAnnouncementWidget;
