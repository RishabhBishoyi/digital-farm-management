const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Seed Medicine Standards if empty
const MedicineStandard = require('./models/MedicineStandard');
const seedMedicines = async () => {
  const count = await MedicineStandard.countDocuments();
  if (count === 0) {
    const medicines = [
      { name: 'Antibiotic X', withdrawalDays: 10, applicableAnimals: ['cow', 'sheep', 'goat'] },
      { name: 'PainRelief Y', withdrawalDays: 5, applicableAnimals: ['cow', 'pig'] },
      { name: 'Vitamin Z', withdrawalDays: 0, applicableAnimals: ['cow', 'sheep', 'goat', 'pig'] },
      { name: 'Wormer A', withdrawalDays: 14, applicableAnimals: ['sheep', 'goat'] },
    ];
    await MedicineStandard.insertMany(medicines);
    console.log('Medicine Standards Seeded');
  }
};
seedMedicines();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
