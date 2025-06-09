const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const router = require('./routes/masterroute');
const {sequelize} = require('./config/database'); 
const setupAssociations = require('./config/associations')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

setupAssociations();

app.get('/', (req, res) => {
  res.send('FutureForge API running!');
});

app.use("/", router);

// Use this working solution - no path parameter
app.use((req, res) => {
  res.status(404).json({ error: "No Page Found" });
});

sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log('Database & tables created/updated!');
  })
  .catch(err => console.log('Error syncing database:', err));

 const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
