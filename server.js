// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();
// import cors from 'cors';


// const visitorSchema=new mongoose.Schema({
//     name:String,
//     email:String,
//     company:String,
//     phoneNumber:String,
//     message:String
// });
// console.log(process.env.DB_URL)
// mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log('Connected to MongoDB'))
// .catch(error => console.error('Error connecting to MongoDB:', error));


// const Visitor=mongoose.model('Visitor',visitorSchema);
// // let connect = async function () {
// //     let isDone =  await mongoose.connect(process.env.DB_URL).then("DB connected")
// //   }
// // connect();

// const app = express();
// app.use(express.json());
// app.use(cors());
// // Define the User model

// app.get("/api/users",(req,res)=>{
//     res.send("API is running fine");
// })

// app.post('/api/users', async (req, res) => {
//     const { name, email, company, phoneNumber, message } = req.body;
//     console.log(req.body);
//     // Create a new user using the User model
//     const newUser = new Visitor(req.body);
//     await newUser.save();
//     res.status(201).json(newUser);
// });

// app.all('/api/*', (req, res) => {
//     res.status(405).json({ message: 'Method Not Allowed' });
// });
// let port = process.env.PORT || 3000;
// app.listen(port,()=>{
//     console.log(`server is up on port ${port}`);
// })

// export default app;
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

dotenv.config();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const visitorSchema = new mongoose.Schema({
    name: String,
    email: String,
    company: String,
    phoneNumber: String,
    message: String
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const Visitor = mongoose.model('Visitor', visitorSchema);

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/users", (req, res) => {
    res.send("API is running fine");
});

app.post('/api/users', async (req, res) => {
    const { name, email, company, phoneNumber, message } = req.body;
    console.log(req.body);

    const newUser = new Visitor(req.body);
    await newUser.save();

    res.status(201).json(newUser);
});

// app.get('/api/download-pdf', (req, res) => {
//     const pdfPath = path.join(__dirname, 'public', 'Souvick_Mukherjee_Internship_Offer_Letter (SIGNED).pdf');

//     // const pdfDoc = new PDFDocument();
//     // pdfDoc.pipe(fs.createWriteStream(pdfPath));
//     // pdfDoc.text('Hello, this is your PDF content.');
//     // pdfDoc.end();

//     res.download(pdfPath);
// });
app.get('/api/read-pdf', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', 'PDF.pdf');

    try {
        const fileStream = fs.createReadStream(pdfPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=PDF.pdf');

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error reading PDF:', error);
        res.status(500).json({ error: 'Error reading PDF.' });
    }
});
app.all('/api/*', (req, res) => {
    res.status(405).json({ message: 'Method Not Allowed' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
export default app;
