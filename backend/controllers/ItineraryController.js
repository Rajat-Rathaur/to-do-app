const Itinerary = require('../models/ItineraryModel');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
// Create a new itinerary
exports.createItinerary = async (req, res) => {
    try {
       
        
      const {user, title, startDate, endDate, description, completed } = req.body;
  
      const newItinerary = new Itinerary({
        user,
        title,
        startDate,
        endDate,
        description,
        completed,
      });
  
      const savedItinerary = await newItinerary.save();
      res.status(201).json(savedItinerary);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

// Get all itineraries for a user
exports.getItineraries = async (req, res) => {
    try {
      const userId = req.params.userId; // Assuming you'll pass the userId in the URL params
  
      console.log('UserId:', userId);
  
      // Check if userId is a valid ObjectId or a string
      let query;
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query = { user: new mongoose.Types.ObjectId(userId) };
      } else if (typeof userId === 'string') {
        query = { user: userId };
      } else {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // Fetch itineraries based on user ID
      const itineraries = await Itinerary.find(query);
  
      console.log('Fetched Itineraries:', itineraries);
  
      res.status(200).json(itineraries);
    } catch (err) {
      console.error('Error fetching itineraries:', err);
      res.status(400).json({ error: err.message });
    }
  };
  
  
  
// Get a specific itinerary
exports.getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.status(200).json(itinerary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an itinerary
exports.updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.status(200).json(updatedItinerary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an itinerary
exports.deleteItinerary = async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
