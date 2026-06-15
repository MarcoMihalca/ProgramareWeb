require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('Lipseste MONGO_URI din .env');
    process.exit(1);
}

const restaurantSchema = new mongoose.Schema(
    {
        id: Number,
        nume: String,
        descriere: String,
        meniu: [
            {
                nume: String,
                pret: Number,
                greutate: String,
                imagine: String
            }
        ]
    },
    { versionKey: false }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Această linie este MAGICĂ. Îi spune serverului:
// "Orice fișier din folderul 'public' (HTML, CSS, JS), dă-i voie browserului să îl citească direct!"
app.use(express.static('public'));

app.get('/api/restaurante', async (req, res) => {
    try {
        const restaurante = await Restaurant.find().lean();
        res.json(restaurante);
    } catch (error) {
        console.error('Eroare la citirea restaurantelor:', error);
        res.status(500).json({ mesaj: 'Nu s-au putut încărca restaurantele din MongoDB.' });
    }
});

async function pornesteServerul() {
    try {
        await mongoose.connect(MONGO_URI);
        app.listen(port, () => {
            console.log(`🚀 Serverul FoodApp rulează la adresa http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Eroare la conectarea la MongoDB:', error);
        process.exit(1);
    }
}

pornesteServerul();