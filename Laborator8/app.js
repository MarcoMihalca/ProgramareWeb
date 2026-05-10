const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// 1. URL-ul de conexiune MongoDB Atlas
// ATENȚIE: Înlocuiește <db_password> cu parola ta reală. 
// Dacă parola are caractere speciale (ex: #, @), acestea trebuie URL-encoded (ex: # devine %23)
const uri = "mongodb+srv://mmihalca:Dimitri2004@cluster0test.vsgnpvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0Test";

const client = new MongoClient(uri);
const dbName = 'students';

// 2. Funcția pentru inserarea documentelor JSON (Tema de lucru)
async function seedDatabase(db) {
    const collection = db.collection('proiecte');
    
    // Verificăm dacă există deja date pentru a nu le duplica la fiecare restart
    const count = await collection.countDocuments();
    if (count === 0) {
        const docs = [
            { week: 1, project: "Configurare Mediu & Atlas", course: "PRW" },
            { week: 2, project: "Interfata JSON si Node.js", course: "PRW" },
            { week: 3, project: "Lucru cu MongoDB", course: "PRW" }
        ];
        await collection.insertMany(docs);
        console.log("✅ Datele de test au fost inserate în MongoDB Atlas!");
    } else {
        console.log("ℹ️ Datele există deja în baza de date, sar peste inserare.");
    }
}

// 3. Ruta principală pentru afișarea datelor în pagina web
app.get('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('proiecte');

        // Preluăm toate documentele din colecție
        const dateProiecte = await collection.find({}).toArray();

        // Construim un tabel HTML simplu
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tema MongoDB - Studenti</title>
                <style>
                    body { font-family: sans-serif; margin: 40px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #4CAF50; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Date din MongoDB Atlas (Colectia: Proiecte)</h1>
                <table>
                    <tr>
                        <th>Saptamana</th>
                        <th>Proiect</th>
                        <th>Curs</th>
                    </tr>
                    ${dateProiecte.map(item => `
                        <tr>
                            <td>${item.week}</td>
                            <td>${item.project}</td>
                            <td>${item.course}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("Eroare la conectarea cu baza de date: " + err.message);
    }
});

// 4. Pornirea serverului și conectarea inițială
async function startServer() {
    try {
        await client.connect();
        console.log("🚀 Conectat cu succes la MongoDB Atlas!");
        
        const db = client.db(dbName);
        await seedDatabase(db); // Populăm baza de date la pornire

        app.listen(port, () => {
            console.log(`🌐 Serverul ruleaza la: http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Eroare critică la pornire:", err);
    }
}

startServer();