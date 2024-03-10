const express=require('express')
const connectDB=require('./connectMongo.js');
// const multer=require('multer')
const { default: mongoose } = require('mongoose');
const { boolean } = require('webidl-conversions');
const app=express();
const port=process.env.PORT || 8000

connectDB();

const userschema= new mongoose.Schema({
    name: String,
    rollno: String,
    branch: String,
    batch: String,
    contact: String,
    email: String,
    event_id: [String],
    isadmin: Boolean,
    password: String
});

const user= new mongoose.model("user", userschema,"users");

async function createuser(name, rollno, branch, batch, contact, email, event_id, isadmin, password){
    try{
        const newuser= new user({
            name, 
            rollno, 
            branch, 
            batch,
            contact, 
            email, 
            event_id, 
            isadmin, 
            password
        });

        const resp=await newuser.save(); 
        console.log(resp);
    }
    catch(err){
        console.log(err);
    }
}

app.get('/', (req, res)=>{
    res.send('Hello from home page.');
});
app.get('/about',(req, res)=>{
    res.send('hello from about page.');
});
app.get('/contact',(req, res)=>{
    res.send('hello from contact us page.');
});
app.get("/admin", async (req, res)=>{
    try{
      if(true){
        let singlePerson = await user.find({email: "gfhgjkhlj@gmail.com", password:'kuchhNhii'});
        // const person=[singlePerson]
        if(singlePerson.isadmin){
            res.send('admin login succesful.')
            //   redirect to admin dashboard

        }
        else{
            res.send('no such admin exists.')
            //   redirect to signup page

        }
      }else{
        res.json({error: "No name query found inside request"})
      }
    }catch(error){
      throw error
    }
  })

app.get('/user',async (req, res)=>{
    try{
        if(true){
          let singlePerson = await user.find({email: "gfhgjkhlj@gmail.com", password:'kuchhNhii'});
          // const person=[singlePerson]
          if(!singlePerson.isadmin){
              res.send('admin login succesful.')
            //   redirect to user dashboard
          }
          else{
              res.send('no such admin exists.')
            //   redirect to signup page
          }
        }else{
          res.json({error: "No name query found inside request"})
        }
      }catch(error){
        throw error
      }
});
app.get('/createuser',(req, res)=>{
    const events=[]
    const respo=createuser("naman", "bt21cse020", "cse","2025","23456543","wgsvsdc@gmail.com",events, true, "kuchhtohai")
    res.send(respo);
});
app.get('/*',(req, res)=>{
    res.send('404 error. page not found.');
});


app.listen(port,()=>{
    console.log(`server is live on port ${port}`)
})

