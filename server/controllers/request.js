import Request from "../models/Request.js";

export const newRequest = async (req, res) => {
    try {
        const {user_id, vehicle_type, date, notes} = req.body;
        const newRequest = new Request({
           user_id: user_id,
           vehicle_type: vehicle_type,
           date: date,
           notes: notes
        });
        await newRequest.save();
        return res.status(200).json({message: "Request sent successfully"});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}