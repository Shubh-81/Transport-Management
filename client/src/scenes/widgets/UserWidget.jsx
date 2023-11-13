import {
  ManageAccountsOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const UserWidget = ({ userId }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const getUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }


  const {
    firstName,
    lastName,
    email,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem">
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>
      <Box p="1rem 0">
        {email!==""&&<Box display="flex" alignItems="center" gap="1rem">
          <MailOutlineIcon fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{email}</Typography>
        </Box>}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
