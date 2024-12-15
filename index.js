const express = require("express");
const { connectToMongoDB } = require("./connect");
const path = require('path');
const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter');
const URL = require("./models/url");
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(console.log("MongoDB Connected"));
  
app.set("view engine","ejs");    //setting for using ejs templating for ssr 
app.set("views",path.resolve("./views")); //telling express that my all ejs files are in this particular folder


app.use(express.json());//to support json data in incoming request use this middleware
app.use(express.urlencoded({extended:true})); //to support form data use this middleware

// app.get("/test",async (req,res)=>{

//    const allUrls = await URL.find({});
//    return res.render('home',
//     {urls:allUrls}) 
    
// });

app.use("/url", urlRoute);//use only with postman with url
app.use('/',staticRoute);// can be used in browser 

 

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry =await URL.findOneAndUpdate({
        shortId
    }, {  
        $push: {
            visitHistory:{timestamp:Date.now(),
            },
        }, 
    }
);
res.redirect(entry.redirectURL);
})



app.listen(PORT, () => console.log(`Server Started at PORT : ${PORT}`));
