import User from '../models/User.js';
import bcrpyt from 'bcrypt';

export const getUser = async (req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err) {
        res.status(403).json({message: err.message});
    }
}

export const getUserFromEmail = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(user)    res.status(200).json(user);
        else {
            res.status(404).json({message: "User not found"});
        }
    } catch(err) {
        res.status(403).json({message: err.message});
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {userId} = req.body;
        const {password} = req.body;
        const user = await User.findById(userId);
        if(!user)   return res.status(404).json({message: "User does not exsist"});
        else {
            const salt = await bcrpyt.genSalt();
            const passwordHash = await bcrpyt.hash(password,salt);
            user.password = passwordHash;
            await user.save();
            res.status(200).json({message: "Success"});
        }
    } catch (err) {
        res.status(500).json({error: err});
    }
}