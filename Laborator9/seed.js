require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Proiect = require('./models/Proiect');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectat la MongoDB');

    // Ștergem tot ce există deja
    await User.deleteMany({});
    await Proiect.deleteMany({});
    console.log('🗑️  Date vechi șterse');

    // Creăm 2 utilizatori
    // Parola se hash-uiește automat prin pre-save hook din User.js
    const admin = await User.create({
        username: 'admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
    });

    const user = await User.create({
        username: 'ion_popescu',
        email: 'ion@test.com',
        password: 'user1234',
        role: 'user'
    });

    console.log('👤 2 utilizatori creați');

    // Creăm 5 proiecte
    await Proiect.insertMany([
        {
            nume: 'Platformă E-Learning',
            descriere: 'Sistem de cursuri online cu video și quiz-uri.',
            pret: 15000,
            esteActiv: true,
            dataLansare: new Date('2024-03-01'),
            categorie: 'Software',
            createdBy: admin._id
        },
        {
            nume: 'Aplicație Mobile Banking',
            descriere: 'App de banking cu autentificare biometrică.',
            pret: 45000,
            esteActiv: true,
            dataLansare: new Date('2024-05-15'),
            categorie: 'Software',
            createdBy: admin._id
        },
        {
            nume: 'Dashboard IoT',
            descriere: 'Interfață pentru monitorizarea dispozitivelor IoT.',
            pret: 8500,
            esteActiv: false,
            dataLansare: new Date('2023-11-01'),
            categorie: 'Hardware',
            createdBy: user._id
        },
        {
            nume: 'Design System Corporate',
            descriere: 'Set de componente UI/UX pentru rebranding.',
            pret: 5000,
            esteActiv: true,
            dataLansare: new Date('2024-01-20'),
            categorie: 'Design',
            createdBy: user._id
        },
        {
            nume: 'CLI Deploy Tool',
            descriere: 'Tool pentru automatizarea deploy-ului pe AWS.',
            pret: 3200,
            esteActiv: true,
            dataLansare: new Date('2024-06-01'),
            categorie: 'Tools',
            createdBy: admin._id
        }
    ]);

    console.log('📦 5 proiecte create');
    console.log('\n✅ Seed gata!');
    console.log('   admin@test.com  / admin123');
    console.log('   ion@test.com    / user1234');

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('❌ Eroare:', err);
    process.exit(1);
});
