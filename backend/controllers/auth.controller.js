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
    const { message, id, token, role } = await authService.login(req.body)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({ message, id, role })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const me = async (req, res) => {
  try {
    const result = await authService.me(req);

    res.status(201).json(result)
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("Me request data: ", req.cookies);

    if (!token) {
      throw new Error("Not authenticated");
    }

    res.clearCookie("token",{ httpOnly: true, secure: false });
    res.status(201).json({ message: "Logged out successfully" })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}