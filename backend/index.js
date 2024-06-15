const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('../backend/connector/dbConnection'); // Import the MongoDB connection function
const userRouter = require('../backend/routes/userRoutes');

//const reqRouter = require('../backend/routes/request')

const cors = require('cors');
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Specify the allowed headers
};

app.use(cors(corsOptions));
// Connect to MongoDB by calling the connectDB function
connectDB();

function isLoggedIn(req,res){
  req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.send('Welcome to the Project API');
});

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));








app.get('/auth/protected',isLoggedIn,(req,res)=>{
  let name = req.user.displayName;
  res.send("Hello ${name}");
});


app.use('/users', userRouter);

//app.use('/oauth',authRouter);
//app.use('/request',reqRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
