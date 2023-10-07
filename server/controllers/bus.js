import User from '../models/User.js';
import Bus from "../models/Bus.js";
import { ObjectId } from 'mongodb';
import {use} from "bcrypt/promises.js";

export const addToBus = async (req,res) => {
    try {
        console.log(req.body);
        const {busName, userId} = req.body;
        const bus = await Bus.findOne({bus: busName});
        console.log(bus)
        if(!bus)    return res.status(500).json({message: "Bus not found"});
        const objectId = new ObjectId(userId)
        const user = await User.findById(objectId);
        console.log(user);
        if(!user)   return res.status(500).json({message: "User not found"});
        bus['people'].append(user);
        await bus.save();
        return res.status(200).json({message: "User added successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const createBus = async (req, res) => {
    try {
        const {name} = req.body;
        console.log(req.body);
        const bus = await Bus.findOne({bus: name});
        console.log(bus)
        if(bus) return res.status(500).json({message: "Bus already exists"});
        const newBus = new Bus({
            bus: name,
            people: []
        });
        console.log(newBus);
        await newBus.save();
        return res.status(200).json({message: "Bus created successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}