import { useState, useEffect } from "react";
import {
    Box, Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";

const AnnouncementBoard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/announcement/get`);
                const data = await response.json();
                console.log(data);
                if (data) {
                    // Sort announcements in reverse chronological order
                    const sortedAnnouncements = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setAnnouncements(sortedAnnouncements);
                }
            } catch (err) {
                console.error("Error fetching announcements:", err);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <WidgetWrapper>
            <Typography variant="h3" fontWeight="500" color={palette.neutral.dark}>
                Announcements
            </Typography>
            <br/>
            <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    maxHeight: "400px", // Set a max height for the scrollable area
                    overflowY: "auto", // Add a vertical scrollbar
                }}
            >
                {announcements.map((announcement, index) => (
                    <Box key={index} sx={{ gridColumn: "span 4" }}>
                        <Typography variant="h5" color={palette.neutral.main}>
                            {announcement.title}
                        </Typography>
                        <Typography variant="body1" color={palette.text.primary}>
                            {announcement.announcement}
                        </Typography>
                        <Typography variant="caption" color={palette.text.secondary}>
                            Posted on: {new Date(announcement.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default AnnouncementBoard;
