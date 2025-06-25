if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const sessions = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js"); 


const listings = require("./routes/listing.js");
const userRoutes = require("./routes/user.js");


app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("DB connected");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}
// app.get("/",(req,res)=>{
//     res.send("Link is working bae!!");
// })

app.use(sessions(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email :  "student1@gmail.com",
        username : "unknown1",
    })

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



const validateReview = (req,res,next)=>{
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

app.use("/listings",listings);
app.use("/",userRoutes);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

// app.get("/listings",async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My home",
//         description: "Great Place to live",
//         price: 1200,
//         location: "Islamabad",
//         country: "Pakistan"
//     })
//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("Check");
// })

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})