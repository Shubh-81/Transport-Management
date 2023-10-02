import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import { Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';

const Scanner = () => {
    const [delay] = useState(1000);
    const [result, setResult] = useState(null); // Initialize result as null
    const { palette } = useTheme();
    const dark = palette.neutral.dark;

    const handleScan = (data) => {
        setResult(data);
    };

    const handleError = (err) => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h3" fontWeight="500">
                    QR Code Scanner
                </Typography>
            </FlexBetween>
            <br />
            <br />
            <FlexBetween>
                <div
                    style={{
                        background: 'white',
                        padding: '6px',
                        height: 'auto',
                        margin: '0 auto',
                        maxWidth: 250,
                        width: '100%',
                    }}
                >
                    <QrReader
                        delay={delay}
                        style={previewStyle}
                        onError={handleError}
                        onScan={handleScan}
                    />
                </div>
            </FlexBetween>
            <br />
            <br />
            {result && (
                <Typography color={dark} variant="h6" fontWeight="400">
                    Scanned Result: {result.text} {/* Extract the text property */}
                </Typography>
            )}
        </WidgetWrapper>
    );
};

export default Scanner;
