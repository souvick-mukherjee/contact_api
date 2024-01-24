import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';


const visitorSchema=new mongoose.Schema({
    name:String,
    email:String,
    company:String,
    phoneNumber:String,
    message:String
});
console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));


const Visitor=mongoose.model('Visitor',visitorSchema);
// let connect = async function () {
//     let isDone =  await mongoose.connect(process.env.DB_URL).then("DB connected")
//   }
// connect();

const app = express();
app.use(express.json());
app.use(cors());
// Define the User model

app.get("/api/users",(req,res)=>{
    res.send("API is running fine");
})

app.post('/api/users', async (req, res) => {
    const { name, email, company, phoneNumber, message } = req.body;
    console.log(req.body);
    // Create a new user using the User model
    const newUser = new Visitor(req.body);
    await newUser.save();
    res.status(201).json(newUser);
});

app.all('/api/*', (req, res) => {
    res.status(405).json({ message: 'Method Not Allowed' });
});
let port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server is up on port ${port}`);
})

export default app;