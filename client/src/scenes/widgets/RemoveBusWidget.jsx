import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import {Typography, useTheme, MenuItem, Select, Button} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';

const RemoveBusWidget = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const [selectedBus, setSelectedBus] = useState(null);
    const [busList, setBusList] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async () => {
        try {
            if(!selectedBus)    return;
            setLoading(true);
            const values = {
                busName: selectedBus
            }
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/bus/delete`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );
            const res = await response.json();
            alert(res.message);
            setLoading(false);
            window.location.reload();
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

    return (
        <WidgetWrapper>
            <Typography color={dark} variant="h3" fontWeight="500">
                Remove Bus
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
            <Button
                fullWidth
                onClick={handleSubmit}
                sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                }}
            >
                {loading?"Loading....":"REMOVE BUS"}
            </Button>

        </WidgetWrapper>
    );
};

export default RemoveBusWidget;
