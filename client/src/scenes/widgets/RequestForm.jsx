import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import {Button} from '@mui/material'
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Request = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const [text,setText] = useState("Form")
    const handleShare = () => {

    }

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Vehicle Request
                </Typography>
            </FlexBetween>
            <Typography color={medium} m="0.5rem 0">
                Click the button below to send a request to admin for vehicle.
            </Typography>
            <Button
                fullWidth
                type="submit"
                onClick={handleShare}
                sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                }}
            >
                {text}
            </Button>
        </WidgetWrapper>
    );
};

export default Request;