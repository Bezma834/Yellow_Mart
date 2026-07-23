import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// temporary in-memory data (no database yet)
let products = [
  {
    id: 1,
    name: "Sample Product",
    description: "This is a test product",
    price: 100
  }
]

// GET all products
app.get("/api/products", (req, res) => {
  res.json(products)
})

// GET single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id))
  res.json(product)
})

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000")
})