const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const router = require('./routes/masterroute');
const {sequelize} = require('./config/database'); 
const setupAssociations = require('./config/associations')

dotenv.config();

const app = express();

// for koyeb
app.set('trust proxy', 1);

// Allowing the frontend origin
app.use(cors({
  origin: 'https://futureforge-8w4k.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

setupAssociations();

app.get('/', (req, res) => {
  res.send('FutureForge API running!');
});

app.get('/health', (req, res) => {
  res.send('FutureForge API running!');
});

app.get('/health', (req, res) => res.sendStatus(200));
app.head('/health', (req, res) => res.sendStatus(200));


app.use("/", router);

//no path parameter
app.use((req, res) => {
  res.status(404).json({ error: "No Page Found" });
});

sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log('Database & tables created/updated!');
  })
  .catch(err => console.log('Error syncing database:', err));

 const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
