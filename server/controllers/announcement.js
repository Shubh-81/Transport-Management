import Announcement from "../models/Announcement.js";

export const newAnnouncement = async (req, res) => {
    try {
        const {title, message} = req.body;
        console.log(req.body);
        const newAnnouncement = new Announcement({
           title: title,
           announcement: message
        });
        await newAnnouncement.save();
        return res.status(200).json({message: "Announcement sent successfully"});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find();
        return res.status(200).json(announcements);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}