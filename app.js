if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




const dbUrl = process.env.ATLASDB_URL;


main()
    .then( () => {
        console.log("Connected to DB");
    })
    .catch( (err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/" , (req, res) => {
//     res.send("Hi, I am root");
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

app.use(
    session({
      store,
      secret: process.env.SECRET, 
      resave: false,         
      saveUninitialized: true, 
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7days*24hrs*60min*60sec*1000milisec 
        maxAge: 7 * 24 * 60 * 60 * 1000,    //When we add them with todays date it will become expiry for after 7 days
        httpOnly: true,  //Used to save from cross scripting attacks
      }
    })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// // Demo User 
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//This star route means ki if koi aisa route search kiya jo exit nahi kr ta tuh ya usko handle krega star means all 
//jo bhi error ayega usko leke next ke through MW ke pass chala jayega 
app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let{statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080 , () => {
    console.log("Server is listening to port 8080");
});