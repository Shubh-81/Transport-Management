import User from '../models/User.js';
import Bus from "../models/Bus.js";
import Ride from "../models/Ride.js";
import {getCurrentDate} from "./dateUtil.js";
import mongoose from "mongoose";

export const addToBus = async (req,res) => {
    try {
        const {busName, userId} = req.body;
        const bus = await Bus.findOne({bus_name: busName});
        if(!bus)    return res.status(500).json({message: "Bus not found"});
        const user = await User.findOne({id: userId});
        if(!user)   return res.status(500).json({message: "User not found"});
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        const ride = await Ride.findOne({user_id: user._id, bus_id: bus._id, boarding_date: today});
        console.log(ride);
        if(ride)   return res.status(500).json({message: "User already added"});
        const newRide = new Ride({
           user_id: user._id,
           bus_id: bus._id,
           boarding_date: today
        });
        console.log(newRide);
        await newRide.save();
        return res.status(200).json(newRide);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const createBus = async (req, res) => {
    try {
        const {busName, capacity} = req.body;
        console.log(req.body);
        const bus = await Bus.findOne({bus_name: busName});
        if(bus) return res.status(500).json({message: "Bus already exists"});
        const newBus = new Bus({
            bus_name: busName,
            capacity: Number(capacity)
        });
        await newBus.save();
        return res.status(200).json({message: "Bus created successfully"});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const listBus = async (req, res) => {
    try {
        const bus = await Bus.find({});
        return res.status(200).json(bus);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

export const getRidesCountForBusInLastTenDays = async (req, res) => {
    try {
        const { busId } = req.body;
        let today = new Date();
        let tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 10);
        const formatDate = (date) => {
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${mm}/${dd}/${yyyy}`;
        };

        today = formatDate(today);
        tenDaysAgo = formatDate(tenDaysAgo);

        const countsPerDay = await Ride.aggregate([
            {
                $match: {
                    bus_id: new mongoose.Types.ObjectId(busId),
                    boarding_date: {
                        $gte: tenDaysAgo,
                        $lte: today
                    }
                }
            },
            {
                $group: {
                    _id: "$boarding_date",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);
        let currentDate = new Date(tenDaysAgo);
        const results = [];
        while (currentDate <= new Date(today)) {
            const dateString = formatDate(currentDate);
            const found = countsPerDay.find(entry => entry._id === dateString);
            results.push({ date: dateString, count: found ? found.count : 0 });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const deleteBus = async (req, res) => {
    try {
        const { busName } = req.body;
        await Bus.deleteOne({ bus_name: busName });
        return res.status(200).json({ message: "Bus deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}



