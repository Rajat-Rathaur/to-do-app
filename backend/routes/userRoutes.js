const express = require('express');
const { signup, signin, getById, updateById, deleteById, updatePassword } = require('../controllers/userController');
const {createItinerary ,getItineraries ,getItinerary , updateItinerary , deleteItinerary} = require('../controllers/ItineraryController');
const userRouter = express.Router();
const User = require("../models/userModel");
const reqAuth = require('../middleware/reqAuth');
const dotenv = require('dotenv');

// dotenv.config();
// const{OAuth2Client} = require('google-auth-library');

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/getById", reqAuth, getById);
userRouter.put("/update/:id", reqAuth, updateById);
userRouter.delete("/delete", reqAuth, deleteById);
userRouter.put("/updatePassword", reqAuth, updatePassword);

userRouter.post("/addtask" ,createItinerary);
userRouter.get("/getItineraries/:userId", getItineraries);
userRouter.get("/getItinerary/:id", getItinerary);
userRouter.put("/updateItinerary/:id", updateItinerary);
userRouter.delete("/deleteItinerary/:id", deleteItinerary);


// userRouter.post('/', async function(req, res, next){
//     res.header('Access-Control-Allow-Origin','http://localhost:3000');
//     res.header('Referrer-Policy','no-referrer-when-downgrade');

//     const redirectUrl = "http://127.0.0.1:3000/oauth";

//     const oAuth2Client = new OAuth2Client(
//         process.env.CLIENT_ID,
//         process.env.CLIENT_SECRET,
//         redirectUrl
//     );

//     const authorizeUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope:'https://www.googleapis.com/auth/userinfo.profile openid',
//         prompt: 'consent'
//     });

//     res.json({url:authorizeUrl})
// });

module.exports = userRouter;
