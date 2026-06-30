import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import errorHandler from './src/middlewares/errorHandler.js'
import authRoutes from './src/routes/auth.routes.js'
import workspaceRoutes from './src/routes/workspace.routes.js'
import boardRoutes from './src/routes/board.routes.js'
import listRoutes from './src/routes/list.routes.js'
import cardRoutes from './src/routes/card.routes.js'
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/cards', cardRoutes)
app.get('/health', (req, res)=>{
    res.json({status: 'ok'})
})

app.use(errorHandler);

export default app;
