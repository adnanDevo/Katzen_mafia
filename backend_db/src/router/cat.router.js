import express from "express"
import { changeBoss, createDon, getCats } from "../controller/cat.controller.js"

export const router = new express.Router()
router.get("/cat", getCats)
router.post("/cat",createDon)
router.put("/cat/:id", changeBoss)