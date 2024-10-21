import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

dotenv.config();  

const app = express();
app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Could not connect to MongoDB', error));

// Model Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: { type: Number, default: 0 },
});

const Url = mongoose.model('url', urlSchema);

// API
app.post('/api/short', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) return res.status(400).json({ message: "originalUrl is required" });

        const shortUrl = nanoid(6);
        const url = new Url({ originalUrl, shortUrl });
        const myUrl = `http://localhost:3000/${shortUrl}`;
        const qrCodeImg = await QRCode.toDataURL(myUrl);

        await url.save();
        return res.status(200).json({ message: "URL is generated", shortUrl: myUrl, qrCodeImg });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error", error });
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        if (url) {
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ message: "URL not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error", error });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
