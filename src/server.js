const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const accountRoutes = require('./routes/accountRouter');
const transactionRoutes = require('./routes/transferRouter');
const connectDB = require('./db'); 
const authRoutes = require('./routes/authRouter');
const verifyToken = require('./middleware/authMiddleware'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Routes
app.use('/api/accounts', verifyToken, accountRoutes);
app.use('/api/transfers', verifyToken ,transactionRoutes);
app.use('/api/auth', authRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1); // Salir del proceso con error
  });