import React, { useState, useEffect } from 'react';
import { Typography, useTheme, MenuItem, Select } from '@mui/material';
import WidgetWrapper from '../../components/WidgetWrapper';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStat = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const [selectedBus, setSelectedBus] = useState(null);
    const [busList, setBusList] = useState([]);
    const [busIds, setBusIds] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Ride Counts',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });

    const getCount = async (bus) => {
        try {
            var busId;
            busIds.forEach((b) => {
                if(b.bus_name === bus) {
                    busId = b._id;
                }
            });
            const values = {
                busId: busId
            };
            console.log(values);
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/bus/count`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                }
            );
            const res = await response.json();
            console.log(res);

            // Update chart data
            setChartData({
                labels: res.map(item => item.date),
                datasets: [
                    {
                        label: 'Ride Counts',
                        data: res.map(item => item.count),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            });
        } catch(err) {
            console.log(err);
        }
    }

    const handleBusChange = async (event) => {
        setSelectedBus(event.target.value);
        await getCount(event.target.value);
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
                setBusIds(res);
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

    return (
        <WidgetWrapper>
            <Typography color={dark} variant="h3" fontWeight="500">
                Bus Statistics from the past 10 days
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
                    {busList.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div style={{ marginTop: '20px', width: '100%' }}>
                <Bar options={{ responsive: true }} data={chartData} />
            </div>
        </WidgetWrapper>
    );
};

export default AdminStat;
