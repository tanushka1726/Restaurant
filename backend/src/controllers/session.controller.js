import Session from '../models/session.model.js';

// Create a new session
export const createSession = async (req, res) => {
    try {
        const { res_Id, restaurant_name, email, contact_no, address, status } = req.body;
        const newSession = new Session({
            res_Id,
            restaurant_name,    
            email,
            contact_no,
            address,
            status: status || 'pending',
        });
        const savedSession = await newSession.save();
        res.status(201).json(savedSession);
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

// Get all sessions
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
};  

// Get a session by ID
export const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session', error: error.message });
    }   
};

// Update a session by ID
export const updateSessionById = async (req, res) => {
    try {
        const { restaurant_name, email, contact_no, address, status } = req.body;
        const updateData = {};
        if (restaurant_name) updateData.restaurant_name = restaurant_name;
        if (email !== undefined) updateData.email = email;
        if (contact_no !== undefined) updateData.contact_no = contact_no;
        if (address) updateData.address = address;
        if (status) updateData.status = status;
        updateData.updatedAt = Date.now();

        const session = await Session.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error: error.message });
    }
};

// Delete a session by ID
export const deleteSessionById = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }   
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting session', error: error.message });
    }
};