import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import {Button} from '@mui/material'
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import { useState } from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({token}) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h3" fontWeight="500">
          QR Code for Bus/Shuttle Entry
        </Typography>
      </FlexBetween>
        <br/>
        <br/>
      <FlexBetween>
        <div style={{background: 'white', padding: '6px' , height: "auto", margin: "0 auto", maxWidth: 250, width: "100%" }}>
          <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={token}
              viewBox={`0 0 256 256`}
          />
        </div>
      </FlexBetween>
        <br/>
        <br/>
    </WidgetWrapper>
  );
};

export default QRCodeGenerator;
