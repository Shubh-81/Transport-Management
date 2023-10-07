import bcrpyt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

export const register = async (req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;
        console.log(req.body)
        let query = []
        query.push({email: email});
        const foundUser = await User.findOne({$or: query});
        if(!foundUser || foundUser.verified === false) {
            const salt = await bcrpyt.genSalt();
            console.log("h");
            const passwordHash = await bcrpyt.hash(password,salt);
            console.log("Here")
            const newUser = new User({
                firstName,
                lastName,
                email,
                userType: 'user',
                password: passwordHash,
            });
            console.log(newUser)
            const savedUser = await newUser.save();
            console.log(savedUser)
            res.status(200).json(savedUser);
        }
    }   catch(err) {
        console.log(err);
        res.status(500).json({error: err.message}); 
    }
};

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body)
        const user = await User.findOne({email:email});
        console.log(user)
        if(!user)   return res.status(400).json({message: "User does not exist"});
        const isMatch = await bcrpyt.compare(password,user.password);
        if(!isMatch)    return res.status(400).json({message: "Invalid Credentials"});
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
        delete(user.password);
        return res.status(201).json({token,user,message: "Login Successful"});
    }   catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const otpVerify = async (req,res) => {
    try {
        const {email} = req.body;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.REACT_APP_EMAIL,
              pass: process.env.REACT_APP_EMAIL_PASS,
            },
          });
          const otp = Math.floor(100000 + Math.random() * 900000);
          let mailOptions = {
            from: process.env.REACT_APP_EMAIL,
            to: email,
            subject: `Otp for verification`,
            html: `Enter OTP ${otp} for verification`,
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json({otp: otp,info: info});
            }
          });
    } catch (err) {
        console.log(err);
    }
}

export const verifyUser = async (req,res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user)   res.status(400).json({message: "User does not exsist"});
        if(user.verified)   res.status(400).json({message: "User already verified"});
        user.verified = true;
        await user.save();
        res.status(200).json({message: "User verified"});
    } catch(err) {
        console.log(err);
    }
}

