import e from "express";
import * as adminServices from "../services/admin.service.js"

export const overviewStats = async (req, res) => {
  try {
    const result = await adminServices.getOverviewStats();
    console.log("result: ", result);
    res.status(201).json(result)
  } catch (err) {
    console.error("Error fetching overview stats: ", err);
    res.status(400).json({ message: "Internal server error" })
  }
}

export const approveRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    await adminServices.approveRequest(userId);
    res.status(200).json({ message: "Request approved successfully" });
  } catch (err) {
    console.error("Error approving request: ", err);
    res.status(400).json({ message: "Internal server error" });
  }
}

export const rejectRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    await adminServices.rejectRequest(userId);
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (err) {
    console.error("Error rejecting request: ", err);
    res.status(400).json({ message: "Internal server error" });
  }
}

export const addUser = async (req, res) => {
  const { role } = req.params;
  try {
    await adminServices.addUser(req.body, role);
    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    console.log("Error, ", error);
    res.status(400).json({ message: "Internal server error" });
  }
}

export const getAllAnnouncements = async (req, res) => {
  try {
    const result = await adminServices.getAllAnnouncements();
    console.log("result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching announcements: ", error);
    res.status(400).json({ message: "Internal server error" });
  }
}

export const createAnnouncement = async (req, res) => {
  try {
    const result = await adminServices.createAnnouncement(req.body);
    console.log("result: ", result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating announcement: ", error);
    res.status(400).json({ message: "Internal server error" });
  }
}

export const getAllClients = async (req, res) => {
  try {
    const result = await adminServices.getClients();
    console.log("result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching clients: ", error);
    res.status(400).json({ message: "Internal server error" });
  }
}