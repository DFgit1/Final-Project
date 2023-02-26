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

app.use(express.static('uploads')); //This makes our uploads folder public
app.use(express.urlencoded({ extended: false }));
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

//     through: Favourite,
// Favourite.hasOne(User, {
//     foreignKey: "user_id"
// });

// Favourite.hasOne(Hike, {
//     foreignKey: "trail_id"
// });



config.authenticate().then(function () {
    console.log("Database is connected");
})
    .catch(function (err) {
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




app.post('/register', upload.single('image'), function (req, res) {
    console.log(req.file);
    let plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hash) {

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

app.post('/login', function (req, res) {

    let userName = req.body.userName;
    let password = req.body.password;
    let user_data = {
        where: { userName } // {userName: userName}
    }

    //Find a user that corresponds to the userName
    User.findOne(user_data).then((result) => {

        if (result) {
            console.log(result);
            bcrypt.compare(password, result.password, function (err, output) {
                console.log(output);
                if (output) {
                    res.status(200).send(result);
                } else {
                    res.status(400).send('Incorrect password.');
                }
            });
        }
        else {
            res.status(404).send('User does not exist.');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });

});




app.get("/hikes", function (req, res) {
    let data2 = {        
        include: [
            {
                model: Review,
                include: [User]
            }
        ]
    }
    Hike.findAll(data2).then(function (results) {
        res.status(200).send(results);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});


app.get("/ratings/:trail_id", function (req, res) {
    let data= {
        where: {trail_id: req.params.trail_id},
    };
    Review.findAll(data).then(function (results) {
        let ratings = results.map(item => item.rating);
        res.status(200).send(ratings);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});




app.get("/reviews", function (req, res) {
    let data = {
        include: [Hike, User]
    }
    Review.findAll(data).then(function (results) {
        res.status(200).send(results);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

app.post("/reviews", function (req, res) {
    Review.create(req.body)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        });
});


//Favourites
app.get('/users', function (req, res) {
    let data = {
        include: Hike,
        where: {}
    };

    if (req.query.id !== undefined) {
        data.where.id = req.query.id;
    };

    User.findAll(data).then(function (results) {
        res.status(200).send(results);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});


app.post("/favourites", function (req, res) {
    Favourite.create(req.body)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        });
});

app.get("/favourites", function (req, res) {
    Favourite.findAll().then(function (results) {
        res.status(200).send(results);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

app.get("/user-favourites/:user_id", function (req, res) {
    let data= {
        where: {user_id: req.params.user_id}
    };
    Favourite.findAll(data).then(function (results) {
        let hikeIds = results.map(item => item.trail_id);
        res.status(200).send(hikeIds);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

//delete fav hike
app.delete("/favourites/:fav_id", function(req, res){
        
    Favourite.findByPk(req.params.fav_id)
    .then(function(result){
    if(result){
           result.destroy().then(function(){
            res.status(200).send(result);
    })
    .catch(function(err){
        res.status(500).send(err);
    });
    }
    else{
        res.status(404).send("Hike was not found");
    }
    })
    .catch(function(err) {
        res.status(500).send(err);
    });

});






app.listen(3000, function () {
    console.log("Server running on port 3000")
});

