const mongoose = require('mongoose');

const proiectSchema = new mongoose.Schema({
    nume: {
        type: String,
        required: [true, 'Numele proiectului este obligatoriu'],
        trim: true
    },
    descriere: {
        type: String,
        required: [true, 'Descriere obligatorie']
    },
    pret: {
        type: Number,
        min: [0, 'Pretul nu poate fi negativ'],
        default: 100
    },
    esteActiv: {
        type: Boolean,
        default: true
    },
    dataLansare: {
        type: Date,
        default: Date.now
    },
    categorie: {
        type: String,
        enum: ['Software', 'Hardware', 'Tools', 'Design'],
        required: true
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Proiect', proiectSchema);