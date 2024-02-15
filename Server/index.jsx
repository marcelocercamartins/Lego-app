const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('bson');

const app = express();
const PORT = 3001;

const uri = "mongodb+srv://marcelocercafmartins:UEzFA10NTFpaEHEe@cluster0.of5xc3u.mongodb.net/"
const database = process.env.DATABASE;
const secret = "fdçlkjdflkjdslfkgjdfkgºpçdfkpdrkgpdrgjkpfkmfdçl"


app.use(cors());
app.options('*', cors())
app.use(express());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));


/////////////////API Endpoints////////////////////////
// Create user
app.post("/register", async (req, res) => {
    const email = req.body.email;
    const username = req.body.name;
    const password = req.body.password;

    const findUserName = await findOneResult("Users", { username: username });

    if (findUserName == null) {
        const saltRounds = 10;
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = { username: username, email: email, password: hashedPassword};
           
            await insertLinesOnDatabase("Users", newUser);

            return res.status(201).send({ msg:"Registered!"});
        } catch (error) {
            console.error("Error creating a User : " + error);
            return res.status(500).send({ msg:'Internal Server Error'});
        }
    } else {
        console.log("User already exist");
        return res.status(409).send({ msg: 'User already exists' });
    }
});


 // Login
app.post("/login", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    const findUser = await findOneResult("Users", { username: name });

    if (findUser != null) 
    {     
        bcrypt.compare(password, findUser.password, (error, isMatch) => {
            if (error) {             
                console.error("Error comparing the password: ", error);
                return res.status(500).send({ msg:'Internal Server Error'});
            }

            if (isMatch) {           
                const payload = { username: name, password: findUser.password };
                const token = jwt.sign(payload, secret, {algorithm: 'HS256', expiresIn: "900s"});
                return res.status(200).json({authToken: token});
            } else { 
                return res.status(401).json({ msg: "Invalid Password!" });
            }
        });
    } else {
        console.log("User not found!");
        return res.status(404).json({ msg: "User not found!" });
    }
}); 

// Create Post
app.post("/registerPost", async (req, res) => {
    try {
        const userToken = verifyToken(req.header('token'));
        if (!userToken){
            return res.status(401).json({msg:"User not autenticated"});
        } 
        const image = req.body.image;
        const title = req.body.title;
        const description = req.body.description;
        const username = req.body.username;

        const insertValue = {image: image, title: title, description: description, username: username};
        await insertLinesOnDatabase("Events", insertValue);
        return res.status(201).send({ msg:"Post added"});
    }catch(err){
        console.log("Internal error in the server endpoint registerPost" + err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Retrieve posts from the user
app.post("/myFavorites", async (req, res) => {
    try{
        const username = req.body.name;
        const filter = { username: username};
        
        const eventsList = await findAll("Events", filter);
        console.log(eventsList)
        return res.status(200).json({ resultSet: eventsList });
    }catch(error){
        console.log("Internal error in the server endpoint myFavorites" + error);
        res.status(500).json({ msg: "Internal server error" });
    }  
});

// Retrieve posts from the favorites
app.post("/myFavoritesList", async (req, res) => {
    try{
        const username = req.body.name;
        const filter = { username: username};
        
        const eventsList = await findAll("Favorites", filter);
        return res.status(200).json({ resultSet: eventsList });
    }catch(error){
        console.log("Internal error in the server endpoint myFavoritesList " + error);
        res.status(500).json({ msg: "Internal server error" });
    }  
});


// Retrieve all the posts, regardless the user
app.get("/allPosts", async (req, res) => {
    try{
         const eventsList = await findAll("Events", {});
        return res.status(200).json({ resultSet: eventsList });
    }catch(error){
        console.log("Internal error in the server endpoint registeredEvents" + error);
        return res.status(500).send({ msg:'Internal server error'});
    } 
});

//remove posts
app.delete("/deletePost/:id", async (req, res) => {
    const eventId = req.params.id; 
       
    try {
        const result = await deleteEvent("Events", eventId);
        if (result.deletedCount === 0) {
            res.status(404).json({ msg: "Post not removed" });
        } else {
            res.status(200).json({ msg: "Removed" });
        }
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" });
    } 
});

//Update posts
app.post("/updatePost", async (req,res) => {
    try{
        const title = req.body.title;
        const description = req.body.description;
        const eventId = req.body._id;
        const image = req.body.image;
        
        const include = {title: title, description: description, image: image};
        await updatePost("Events", eventId, include);
        res.status(200).json({ msg: "Post updated" });
    }catch(error){
        console.log("Internal error in the server endpoint postInfoUpdate " + error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

//add to favorites
app.post("/addFavorite", async (req,res) => {
    const eventId = req.body._id;
    const username = req.body.name;
    const image = req.body.image;
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;
    const findFavorite = await findOneResult("Favorites", { eventId: eventId});
    
    if (findFavorite === null) {
        try {
            const include = {username: username, eventId: eventId, title: title, description: description, image: image, author: author}
            await insertLinesOnDatabase("Favorites", include);
            res.status(200).json({ msg: "Added to favorites" });
        } catch(error) {
            console.log("Internal error in the server endpoint postInfoUpdate " + error);
            res.status(500).json({ msg: "Internal server error" });
        }
    } else {
        return res.status(409).send({ msg: "Already added" })
    }
});

//remove from favorites
app.delete("/deleteFavorite/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
        const result = await deleteEvent("Favorites", eventId);
        if (result.deletedCount === 0) {
            res.status(404).json({ msg: "Post not removed" });
        } else {
            res.status(200).json({ msg: "Removed" });
        }
    } catch (err) {
        console.log("Internal error in the server endpoint deleteEvent " + error);
        res.status(500).json({ msg: "Internal server error" });
    }
});


//functions to connect to database

async function findOneResult(table, findWhat) {
    const dbConn = new MongoClient(uri);
    try {
        const findResult = await dbConn.db(database).collection(table).findOne(findWhat);
        console.log("findOneResult: " + findResult);
        await dbConn.close();
        return findResult;
    } catch (err) {
        console.log(err);
    } finally {
        await dbConn.close();
    }
}


async function insertLinesOnDatabase(table, valuetToInsert) {
    const dbConn = new MongoClient(uri);

    try {
        const insert_db = await dbConn.db(database);
        insert_db.collection(table).insertOne(valuetToInsert, function (err, res) {
            if (err) {
                res.send(JSON.stringify(err));
            } else {
                
                res.send("inserted!");
            }
        });
    } catch (err) {
        console.log(err);
    } finally {
        await dbConn.close();
    }
}

async function findAll(table, filter) {
    const dbConn = new MongoClient(uri);

    try {
        const findResult = await dbConn.db(database).collection(table).find(filter).toArray();
        await dbConn.close();
        return findResult;
    } catch (err) {
        console.log(err);
    } finally {
        await dbConn.close();
    }
}

async function deleteEvent(table, eventId) {
    const dbConn = new MongoClient(uri);
    try {
        await dbConn.connect();
        const deleteResult = await dbConn.db(database).collection(table).deleteOne({ _id: ObjectId.createFromHexString(eventId)});
        return deleteResult;
    } catch (err) {
        console.error(err);
        throw err; 
    } finally {
        await dbConn.close();
    }
}

async function updatePost(table, filter,  value) {
    console.log(table, filter,  value)
    const dbConn = new MongoClient(uri);
    try {
        const insert_db = await dbConn.db(database);
        insert_db.collection(table).updateOne({ _id: ObjectId.createFromHexString(filter)}, {$set: value});
    } catch (err) {
        console.log(err)
    } finally {
        await dbConn.close();
    }
} 

function verifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return false;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});