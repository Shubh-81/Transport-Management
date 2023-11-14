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
          <Box m="2rem 0" />
            <Box m="2rem 0" />

                {isNonMobileScreens&&<UserWidget userId={_id} />}

        </Box>


        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            {userType === 'user' ? <QRCodeGenerator token={id}/> : (userType === 'admin' ? <AdminStat/> : <Scanner/>)}

        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            {userType === 'admin' ? <AddBusWidget/> : userType === 'user' && <Request/>}

            <Box m="2rem 0">
                {userType === 'admin' ? <RemoveBusWidget/> : null}
            </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
