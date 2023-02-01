const express = require("express")
const app = express();
const config = require("./config");
const Hike = require("./models/Hike");
const User = require("./models/User");
const Favourite = require("./models/Favourite");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
require("dotenv").config();
const Review = require("./models/Review");

const request = require('request');


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors()); 



//ASSOCIATIONS
Review.belongsTo(User, {
    foreignKey: "user_id"
});

User.hasMany(Review, {
    foreignKey: "user_id"
});

Review.belongsTo(Hike, {
    foreignKey: "trail_id"
});

Hike.hasMany(Review, {
    foreignKey: "trail_id"
});


//Favourites
User.belongsToMany(Hike, {
    through: Favourite,
    foreignKey: "user_id"
});

Hike.belongsToMany(User, {
    through: Favourite,
    foreignKey: "trail_id"
});




config.authenticate().then(function(){
    console.log("Database is connected");
})
.catch(function(err){
    console.log(err);
});

//Configure Multer
let storage = multer.diskStorage({
    destination: (req, file, cb) => {    
      cb(null, './uploads'); //Defining where uploads images should be stored
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); //Name of the uploaded file
    }
  });
  let upload = multer({
    storage: storage
  });
  



app.post('/register', upload.single('image'), function(req, res){
    console.log(req.file);
    let plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
        
        let user_data = {
            email: req.body.email,
            password: hash,
            userName: req.body.userName,
            image: req.file ? req.file.filename : null
        };

        User.create(user_data).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });

    });    
});

app.post('/login', function(req, res){

    let userName = req.body.userName;
    let password = req.body.password;
    let user_data = {
        where: {userName} // {userName: userName}
    }
    
    //Find a user that corresponds to the userName
    User.findOne(user_data).then((result) => {

        if(result){
            console.log(result);
            bcrypt.compare(password, result.password, function(err, output) {
                console.log(output);
                if(output){
                    res.status(200).send(result);
                }else{
                    res.status(400).send('Incorrect password.');
                }
            });            
        }
        else{
            res.status(404).send('User does not exist.');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
        
});

app.get("/hikes", function(req,res){
    let data2  = {
       include: Review
    }
    Hike.findAll(data2).then(function(results){
        res.status(200).send(results);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.get("/reviews", function(req,res){
    let data = {
       include: Hike
    }
    Review.findAll(data).then(function(results){
        res.status(200).send(results);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.post("/reviews", function(req, res){
    Review.create(req.body)
    .then(function(result){
        res.send(result);
    })
    .catch(function(err){
        res.send(err);
    });
    });


//Favourites
app.get('/users', function(req, res){
    let data = {
        include: Hike,
        where: {}};
    
    if(req.query.id !== undefined){
        data.where.id = req.query.id;
    };

    User.findAll(data).then(function(results){
        res.status(200).send(results);
    }).catch(function(err){
        res.status(500).send(err);
    });
});


app.post("/favourites", function(req, res){
    Favourite.create(req.body)
    .then(function(result)
    {
        res.send(result);
    })
    .catch(function(err){
        res.send(err);
    });
    });

//weatherAPI
// app.get('/get-weather', (req, res) => {
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=51.1762&lon=-115.5698&units=metric&appid=ca55b20dd0c0e1bbd5e0bfc508ddc1d2`;
    
//     // `https://api.openweathermap.org/data/2.5/weather?lat=51.1762&lon=-115.5698&units=metric&appid=${process.env.API_KEY}`;

//     // Request the url 
//     request(url, (err, response, body) => {
//         if (err) {
//             return res.json({
//                 success: false,
//                 err: 'Cannot get the weather details! Please try again later.'
//             })
//         } else {
//             let weather =  JSON.parse(body);
//             return weather;
//         }
//     });
// });



app.listen(3000, function(){
    console.log("Server running on port 3000")
});

