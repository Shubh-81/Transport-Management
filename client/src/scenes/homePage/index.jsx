import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../scenes/navbar";
import UserWidget from "../../scenes/widgets/UserWidget";
import QRCodeGenerator from '../widgets/QRCodeGenerator';
import Scanner from "../widgets/Scanner";


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
          {isNonMobileScreens&&<UserWidget userId={_id} />}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            {userType === 'user' ? <QRCodeGenerator token={id}/> : <Scanner/>}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >

            <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
