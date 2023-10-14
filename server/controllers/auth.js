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
            role
        } = req.body;
        let query = []
        query.push({email: email});
        const pattern = /@iitgn\.ac\.in$/;
        if(role === 'user' && !pattern.test(email)) return res.status(500).json({message: "Please register only using Institute Email"});
        const foundUser = await User.findOne({$or: query});
        if(!foundUser || foundUser.verified === false) {
            const salt = await bcrpyt.genSalt();
            const emailSalt = await bcrpyt.genSalt();
            const passwordHash = await bcrpyt.hash(password,salt);
            const id = await bcrpyt.hash(email, emailSalt);
            const newUser = new User({
                firstName,
                lastName,
                email,
                userType: role.toLowerCase(),
                password: passwordHash,
                id: id
            });
            const savedUser = await newUser.save();
            return res.status(200).json(savedUser);
        }
        return res.status(500).json({message: "User with this email already exist, please login."});
    }   catch(err) {
        res.status(500).json({error: err.message}); 
    }
};

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
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

