import User from '../models/User.js';
import Bus from "../models/Bus.js";

export const addToBus = async (req,res) => {
    try {
        const {busName, userId} = req.body;
        const bus = await Bus.findOne({bus: busName});
        if(!bus)    return res.status(500).json({message: "Bus not found"});
        const user = await User.findOne({id: userId});
        if(!user)   return res.status(500).json({message: "User not found"});
        if(bus.people.includes(user.email)) return res.status(200).json({message: "User already added"});
        bus.people.push(user.email);
        await bus.save();
        return res.status(200).json({message: "User added successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const createBus = async (req, res) => {
    try {
        const {name} = req.body;
        const bus = await Bus.findOne({bus: name});
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

export const listBus = async (req, res) => {
    try {
        const bus = await Bus.find({});
        const r = bus.map(item => item.bus);
        return res.status(200).json(r);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}