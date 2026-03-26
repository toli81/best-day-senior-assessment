import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from the Vite build output
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback - serve index.html for all non-file routes
app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Best Day Assessment running on port ${PORT}`)
})
