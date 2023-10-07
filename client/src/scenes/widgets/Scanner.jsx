import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';

const Scanner = () => {
    const [delay] = useState(100);
    const [result, setResult] = useState(null);
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const [scannerEnabled, setScannerEnabled] = useState(true); // Added scannerEnabled state

    const addUser = async (userId) => {
        try {
            const values = {
                busName: "kudasan",
                userId: userId
            }
            const response = await fetch(
                "http://localhost:3001/bus/add",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );
            console.log(response)
        } catch(err) {
            console.log(err);
        }
    }
    const handleScan = async (data) => {
        if(data && data.text)  {
            setResult(data);
            setScannerEnabled(false);
            await addUser(data.text);
            setTimeout(() => {
                setResult(null);
                setScannerEnabled(true);
            }, 5000);
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const previewStyle = {
        height: 250,
        width: 250,
    };

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h3" fontWeight="500">
                    QR Code Scanner
                </Typography>
            </FlexBetween>
            <FlexBetween>
                <div
                    style={{
                        margin: '0 auto',
                        maxWidth: 250,
                        width: '100%',
                    }}
                >
                    {scannerEnabled && ( // Render the QR scanner only if it's enabled
                        <QrReader
                            delay={delay}
                            style={previewStyle}
                            onError={handleError}
                            onScan={handleScan}
                        />
                    )}
                </div>
            </FlexBetween>
            {result && (
                <div>
                    <Typography
                        color={dark}
                        variant="h3"
                        fontWeight="400"
                    >
                        QR Scanned Successfully.
                    </Typography>
                    <div
                        style={{
                            fontSize: '64px',
                            color: 'green',
                            textAlign: 'center',
                        }}
                    >
                        &#10004;
                    </div>
                </div>
            )}
        </WidgetWrapper>
    );
};

export default Scanner;
