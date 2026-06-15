require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Lipseste MONGO_URI din .env. Adauga conexiunea Atlas inainte sa rulezi scriptul.');
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
        imagine: String,
      },
    ],
  },
  { versionKey: false }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const restaurante = [
  {
    id: 1,
    nume: 'Burger Station',
    descriere: 'Cei mai suculenti burgeri din oras.',
    meniu: [
      {
        nume: 'Burger Clasic',
        pret: 42,
        greutate: 'aprox. 280 g',
        imagine: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Cheeseburger',
        pret: 45,
        greutate: 'aprox. 300 g',
        imagine: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: 2,
    nume: 'Pizza Express',
    descriere: 'Pizza pe vatra, livrata rapid.',
    meniu: [
      {
        nume: 'Pizza Margherita',
        pret: 35,
        greutate: 'aprox. 420 g',
        imagine: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Pizza Diavola',
        pret: 40,
        greutate: 'aprox. 460 g',
        imagine: 'https://plus.unsplash.com/premium_photo-1733259709671-9dbf22bf02cc?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
  },
  {
    id: 3,
    nume: 'Dulce & Cafea',
    descriere: 'Deserturi de casa si cafea de specialitate.',
    meniu: [
      {
        nume: 'Prajitura cu mere',
        pret: 15,
        greutate: 'aprox. 180 g',
        imagine: 'https://plus.unsplash.com/premium_photo-1694336203192-c9e7f2891b95?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        nume: 'Cappuccino',
        pret: 12,
        greutate: 'aprox. 250 ml',
        imagine: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: 4,
    nume: 'Sushi Garden',
    descriere: 'Rulouri proaspete, ramen si arome japoneze.',
    meniu: [
      {
        nume: 'California Roll',
        pret: 38,
        greutate: 'aprox. 240 g',
        imagine: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Ramen Miso',
        pret: 39,
        greutate: 'aprox. 520 g',
        imagine: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: 5,
    nume: 'Grill House',
    descriere: 'Meniu savuros cu preparate la gratar si garnituri consistente.',
    meniu: [
      {
        nume: 'Pui la Gratar',
        pret: 36,
        greutate: 'aprox. 350 g',
        imagine: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Cartofi Wedges',
        pret: 16,
        greutate: 'aprox. 180 g',
        imagine: 'https://images.unsplash.com/photo-1604908554162-45f8b4b6d6bd?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: 6,
    nume: 'Taco Fiesta',
    descriere: 'Tacos, burrito si sosuri care merg perfect cu serile relaxate.',
    meniu: [
      {
        nume: 'Taco Chicken',
        pret: 28,
        greutate: 'aprox. 220 g',
        imagine: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Burrito Beef',
        pret: 33,
        greutate: 'aprox. 430 g',
        imagine: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: 7,
    nume: 'Crispy Store',
    descriere: 'Crispy crocant, portii satioase si sosuri care merg perfect cu fiecare comanda.',
    meniu: [
      {
        nume: 'Crispy Burger',
        pret: 39,
        greutate: 'aprox. 310 g',
        imagine: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Crispy Strips',
        pret: 31,
        greutate: 'aprox. 260 g',
        imagine: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=80',
      },
      {
        nume: 'Crispy Bucket',
        pret: 54,
        greutate: 'aprox. 620 g',
        imagine: 'https://images.unsplash.com/photo-1604908177522-040fa4f6bcd5?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
];

async function seedRestaurante() {
  try {
    await mongoose.connect(MONGO_URI);
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(restaurante);

    console.log(`Am populat baza de date cu ${restaurante.length} restaurante.`);
  } catch (error) {
    console.error('Eroare la popularea bazei de date:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedRestaurante();