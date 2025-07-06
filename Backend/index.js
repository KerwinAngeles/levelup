const express = require('express');
const cors = require('cors');
const sequelize= require('./config/db');
const path = require('path');
const fs = require('fs');
const User = require('./Models/User');
const Mission = require('./Models/Mission');
const Award = require('./Models/Award');
const Rank = require('./Models/Rank');

require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

//Middlewares

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/api/auth', require('./Routes/auth'));
app.use('/api/profile', require('./Routes/profile'));
app.use('/api/upload', require('./Routes/upload'));
app.use('/api/missions', require('./Routes/mission'));
app.use('/api/awards', require('./Routes/award'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Relationship

User.hasMany(Mission, {foreignKey: 'userId'});
Mission.belongsTo(User, {foreignKey: 'userId'});

User.hasMany(Award, {foreignKey: 'userId'});
Award.belongsTo(User, {foreignKey: 'userId'});

User.hasOne(Rank, {foreignKey: 'userId'});
Rank.belongsTo(User, {foreignKey: 'userId'});


// Start App
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});