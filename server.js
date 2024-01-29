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

const pdfSchema = new mongoose.Schema({
    email: String
})

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

const Visitor = mongoose.model('Visitor', visitorSchema);
const Pdf = mongoose.model('Pdf',pdfSchema);

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

app.post('/api/extract-email', async (req, res) => {
    const { email } = req.body;

    try {
        const newUser = new Pdf({ email });
        await newUser.save();

        res.status(201).send("Email Recieved");
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Error saving user.' });
    }
});

app.get('/api/read-pdf', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', 'ShihaanTech_ebook.pdf');

    try {
        const fileStream = fs.createReadStream(pdfPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=ShihaanTech_ebook.pdf');

        fileStream.pipe(res);
    } catch (error) {
        console.error('Error reading PDF:', error);
        res.status(500).json({ error: 'Error reading PDF.' });
    }
});
app.all('/api/*', (req, res) => {
    res.status(405).json({ message: 'Method Not Allowed' });
});





const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
export default app;
