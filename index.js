const express=require('express')
const connectDB=require('./connectMongo.js');
const path = require('path');
const fs=require('fs')
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const { boolean } = require('webidl-conversions');
const app=express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


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
    password: String
});
const adminschema= new mongoose.Schema({
    name: String,
    contact: String,
    email: String,
    password: String
});
const contactschema= new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    message: String
});



const user= new mongoose.model("user", userschema,"users");
const admin= new mongoose.model("admin", adminschema,"admins");
const contact= new mongoose.model("contact", contactschema, "contacts")


async function createuser(name, rollno, branch, batch, contact, email, event_id, password){
    try{
        const newuser= new user({
            name, 
            rollno, 
            branch, 
            batch,
            contact, 
            email, 
            event_id,
            password
        });

        const resp=await newuser.save(); 
        console.log(resp);
    }
    catch(err){
        console.log(err);
    }
}
async function createcontact(name, email, phone, message){
    try{
        const newcontact= new contact({
            name, 
            email, 
            phone, 
            message
        });

        const resp=await newcontact.save(); 
        console.log(resp);
    }
    catch(err){
        console.log(err);
    }
}
const replceval=(tempval, val)=>{
    console.log(val[0].name);
    let data1=tempval.replace("{%sname%}", val[0].name)
    data1=data1.replace("{%semail%}", val[0].email)
    data1=data1.replace("{%scontact%}", val[0].contact)
}


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,"/public/home.html"));
});
app.get('/about',(req, res)=>{
    res.sendFile(path.join(__dirname,"/public/about.html"));
});
app.get('/contact',(req, res)=>{
    res.sendFile(path.join(__dirname,"/public/contact.html"));
});
app.get("/adminlogin", async (req, res)=>{
    res.sendFile(path.join(__dirname,"/public/adminlogin.html"))
})
app.post('/adminlogin',async (req, res)=>{
    const {email, Pass}= req.body;
    console.log(req.body);
    try{
        if(true){
          let singlePerson = await admin.find({email: `${email}`, password: `${Pass}`});
          console.log(singlePerson);
            if(singlePerson){
                console.log('logged in')
                res.sendFile(path.join(__dirname,"/public/admin.html"))
                //   redirect to admin dashboard
            }
            else{
                console.log('no such user exists.')
                res.sendFile(path.join(__dirname,'/public2/adminlogin.html'))
                //   redirect to signin page
            }

        }else{
          res.json({error: "No name query found inside request"})
        }
      }catch(error){
        throw error
      }
});
// app.get('/', async (req, res) => {
//     try {
//     const collection = client.db('techClub_nituk').collection('users');
//     const documents = await collection.find({}).toArray();
//     res.render('/public/userdashboard.html', { items: documents });
//     } catch (err) {
//     console.error(err);
//     res.send("Error fetching data");
//     }
// });
app.post('/userlogin',async (req, res)=>{
    const {email, Pass}= req.body;
    console.log(req.body);
    try{
        if(true){
          let singlePerson = await user.find({email: `${email}`, password: `${Pass}`});
          console.log(`singlePerson ${singlePerson}`);

            if(singlePerson){
                try{
                    // const sperson=[singlePerson]
                    // const studata=fs.readFileSync(path.join(__dirname,"public/userdashboard.html"), "utf-8")
                    // const currdata= sperson.map((val)=>{
                    //     replceval(studata, val);
                    // }).join("");
                    // console.log(currdata)
                    // res.send(currdata);
                    console.log('logged in')
                    res.sendFile(path.join(__dirname,"/public/userdashboard.html"))
                    //   redirect to user dashboard                    
                } catch (err) {
                console.error(err);
                res.send("Error fetching data");
                }

            }
            else{
                console.log('no such user exists.')
                res.sendFile(path.join(__dirname,'/public/login2.html'))
                //   redirect to signup page
            }

        }else{
          res.json({error: "No name query found inside request"})
        }
      }catch(error){
        throw error
      }
});
app.get('/userlogin',(req, res)=>{
    res.sendFile(path.join(__dirname,'/public/login2.html'))
});
app.get('/createuser',(req, res)=>{
    res.sendFile(path.join(__dirname,'/public/login.html'))
});
app.post('/createuser', async (req, res) => {
    const {rollno, name, branch, batch, contact, email, Pass} = req.body;
    // console.log(`${name}, ${rollno}, ${branch}, ${batch}, ${contact}, ${email}, ${Pass}`)
    const events=[]
    const respo= await createuser(name, rollno, branch, batch, contact, email, events, Pass);
    res.send('Login successful!');
});
app.post('/createcontact', async(req, res)=>{
    const {name, email, phone, message}= req.body;

    const respo= await createcontact(name, email, phone, message);
    res.sendFile(path.join(__dirname,"/public/contact.html"))
});
app.get('/chatbot',(req, res)=>{
    res.sendFile(path.join(__dirname,"/public/chatbot.html"))
});
app.get('/*',(req, res)=>{
    res.send('404 error. page not found.');
});


app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`server is live on port ${port}`)
    }
})

