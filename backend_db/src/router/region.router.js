import express from "express"

import { getRegions,changeOwner  ,gewinnerZeigen } from "../controller/region.controller.js"

export const router = new express.Router()
router.get("/region", getRegions)
router.put("/region/:id", changeOwner)
router.put("/region/gewinner/:id", gewinnerZeigen)