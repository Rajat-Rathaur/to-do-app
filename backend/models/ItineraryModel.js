const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    description: { type: String, required: true },
    completed: { type: String, required: true },

});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
