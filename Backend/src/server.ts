import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SequelizeConfig from './config/db.config.js';
import TaskRoutes from './routes/TaskRoutes.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use ( cors({
   origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use('/api/task',TaskRoutes);

const startServer = async (): Promise<void> => {
  try {
    await SequelizeConfig.authenticate();
    console.log('PostgreSQL connected successfully');
    await SequelizeConfig.sync({ alter: true });
    app.listen(port, () => console.log('Server is Running on port ' + port));
  } catch (error) {
    console.error('Unable to connect to DB:', error);
    process.exit(1);
  }
};

startServer();


