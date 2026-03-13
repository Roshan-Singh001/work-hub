import { console } from "inspector";
import * as authService from "../services/auth.service.js"

export const register = async (req, res) => {
  try {
    const result = await authService.register(req)
    console.log("result: ", result);
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}