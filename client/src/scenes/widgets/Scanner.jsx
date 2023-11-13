import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { Typography, useTheme, MenuItem, Select } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';

const Scanner = () => {
    const [delay] = useState(100);
    const [result, setResult] = useState(null);
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const [scannerEnabled, setScannerEnabled] = useState(true);
    const [correctQR, setCorrectQR] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [busList, setBusList] = useState([]);

    const handleBusChange = (event) => {
        setSelectedBus(event.target.value);
    };

    const listBuses = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/bus/list`,
                {
                    method: "GET",
                }
            );
            const res = await response.json();
            if(res) {
                const r = res.map(item => item.bus_name);
                setBusList(r);
            }
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await listBuses();
        };
        fetchData();
    }, []);

    const addUser = async (userId) => {
        try {
            if(!selectedBus)    return;
            const values = {
                busName: selectedBus,
                userId: userId
            }
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/bus/add`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );
            const res = await response;
            console.log(res);
            if(res.status === 200) {
                setCorrectQR(true);
            }
        } catch(err) {
            console.log(err);
        }
    }
    const handleScan = async (data) => {
        console.log(data);
        if(data && data.text)  {
            setResult(data);
            setScannerEnabled(false);
            await addUser(data.text);
            setTimeout(() => {
                setResult(null);
                setCorrectQR(false);
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
                <Typography color={dark} variant="h3" fontWeight="500">
                    QR Code Scanner
                </Typography>
                <div style={{ marginTop: '20px' }}>
                    <Typography
                        color={dark}
                        variant="h5"
                        fontWeight="500"
                    >
                        Select Bus:
                    </Typography>
                    <Select
                        value={selectedBus}
                        onChange={handleBusChange}
                        style={{ width: '100%' }}
                    >
                        {busList && busList.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

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
                        QR Scanned {correctQR ? 'Successfully' : 'Unsuccessfully'}
                    </Typography>
                    <div
                        style={{
                            fontSize: '64px',
                            color: correctQR ? 'green' : 'red', // Use green for success and red for failure
                            textAlign: 'center',
                        }}
                    >
                        {correctQR ? '✓' : '✘'} {/* Display a checkmark or cross */}
                    </div>
                </div>
            )}
        </WidgetWrapper>
    );
};

export default Scanner;
