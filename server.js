import express from "express"
import cors from "cors"
import mongodb from "mongodb"
import dotenv from "dotenv"
import ReastaurantsDAO from './DAO/restaurantsDAO.js';
import restaurants from "./api/restaurants.route.js"

dotenv.config();
const port = process.env.PORT || 8000;
const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1/restaurants", restaurants)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

const mongoClient = mongodb.MongoClient

mongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
    maxPoolSize: 50,
    connectTimeoutMS: 2500
})
    .then(client => {
        ReastaurantsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`Database on\napp is listening on port ${port}`)
        })
    })
    .catch(err => {
        console.error(err);
        process.exit(1)
    })

