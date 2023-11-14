import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../scenes/navbar";
import UserWidget from "../../scenes/widgets/UserWidget";
import QRCodeGenerator from '../widgets/QRCodeGenerator';
import Scanner from "../widgets/Scanner";
import AddBusWidget from "../widgets/AddBusWidget";
import AdminStat from "../widgets/AdminStat";
import Request from "../widgets/RequestForm";
import FlexBetween from "../../components/FlexBetween";
import RemoveBusWidget from "../widgets/RemoveBusWidget";
import AddAnnouncementWidget from "../widgets/AddAnnouncementWidget";
import AnnouncementBoard from "../widgets/AnnouncementBoard";

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, userType, id } = useSelector((state) => state.user);

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={_id}/>

                    {(userType === 'admin' || userType === 'user')  && (
                        <Box m="2rem 0">
                            {userType === 'admin' ? <AddAnnouncementWidget/> :  <AnnouncementBoard/>}
                        </Box>
                    )}
                </Box>

                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={!isNonMobileScreens ? "2rem" : undefined}
                >
                    {userType === 'user' ? <QRCodeGenerator token={id}/> : (userType === 'admin' ? <AdminStat/> : <Scanner/>)}
                </Box>

                <Box
                    flexBasis={isNonMobileScreens ? "26%" : undefined}
                    mt={!isNonMobileScreens ? "2rem" : undefined}
                >
                    {userType === 'admin' && <AddBusWidget/>}
                    {userType === 'user' && <Request/>}

                    {userType === 'admin' && (
                        <Box m="2rem 0">
                            <RemoveBusWidget/>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
