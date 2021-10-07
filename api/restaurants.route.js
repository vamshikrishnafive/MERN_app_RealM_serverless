import express from "express"
import ReastaurantsCtrl from "./restaurants.controller.js"
const router = express.Router();

router.route('/').get(ReastaurantsCtrl.apiGetReastaurants)

export default router
