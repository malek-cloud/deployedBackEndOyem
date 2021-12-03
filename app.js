const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');

const app = express();


//DISKSTORAGE
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './photos');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});


//aa
//FILTER
const fileFilter = (req, file, cb)=>{
  if(
    file.mimetype === 'image/png' ||
    file.mimetype ==='image/jpg' ||
    file.mimetype ==='image/png'||
    file.mimetype ==='video/mp4'||
    file.mimetype ==='video/mkv'||
    file.mimetype ==='audio/mp3'||
    file.mimetype === 'audio/wav'
  ){
    cb(null,true);
  }
  else {
    cb(null,false);
  }
};

app.use(bodyParser.urlencoded({extended: false})); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage,limits: {
    fieldNameSize: 500,
    fileSize: 3048576, // 10 Mb
  },
   fileFilter: fileFilter }).single('image')
);
app.use('/photos', express.static(path.join(__dirname,'photos')));
app.use(express.static(path.join('public')));




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', postsRoutes);
app.use('/auth', authRoutes);
app.use('/employee', employeeRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose

  .connect(
    'mongodb+srv://malek-01:kisstherain@cluster0.2mjlv.mongodb.net/OyemUnity?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    app.listen(5000);
    console.log("connected");
  })
  .catch(err => console.log(err));

  