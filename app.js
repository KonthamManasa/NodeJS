//console.log("hi");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { register } = require("module");
const path = require("path");
const app = express();
app.listen(5000,function(){
    console.log('Server is Running Successful');
});
app.use(bodyParser.urlencoded({
    extended:true
}));

const static_path = path.join(__dirname,'public');
app.use(express.static(static_path));

mongoose.connect("mongodb://localhost:27017/hrs",{
    useNewUrlParser:true
}).then(()=>{
    console.log("Connection is successful");
}).catch(()=>{
    console.log("Connection is failed");
});
//set server engine
app.set("view engine","ejs");
//set server start up page
app.get("/",(req,res)=>{
    res.render("index");
});
// set server register get page
app.get("/register",(req,res)=>{
    res.render("register");
});
// create mode class
const registerSchema = {
    fullname:String,
    email:String,
    password:String
};
//collection name
const Register = mongoose.model("customers",registerSchema);
// set server register post page
app.post("/register",(req,res)=>{
   console.log(req.body.fullname);
   console.log(req.body.email);
   console.log(req.body.password);
   // send data to database
   const reg = new Register({
    fullname:req.body.fullname,
    email:req.body.email,
    password:req.body.password
   });
   reg.save().then(()=>{
    console.log("Data stored success")
    // email configuration
    var sentinfo = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'konthammanasa84@gmail.com',
            pass:'sqmw rafc yonk mshk'
        }
    });

    var sendMessage ={
        from:'konthammanasa84@gmail.com',
        to:req.body.email,
        subject:'Taj Hotel',
        text:'Welcome To Taj Hotel...Thank You For Choosing Our Hotel'
    };

    sentinfo.sendMail(sendMessage,((err,info)=>{
        if(err) {
            throw err;

        }
        else{
            console.log('email sent success'+info.response);
        }
    }))
   }).catch(()=>{
    console.log("Data failied to store")
   });

});
// set server login page
app.get("/login",(req,res)=>{
    res.render("login");
});

// set server post login page
app.post("/login",async(req,res)=>{
    console.log(req.body.email);
    console.log(req.body.password);

    // create object to store email and password
    const email = req.body.email;
    const password = req.body.password;
    // check email is available
    const checkemail =await Register.findOne({email:email});
    if(checkemail.password===password)
    {
        console.log("login success");
        res.render("dashboard");
    }
    else
    {
       console.log("login failed");
    }
});

app.get("/dashboard",(req,res)=>{
    res.render("dashboard");
});
