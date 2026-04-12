import { prisma } from "../config/db.ts"
import jwt from "jsonwebtoken";


export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

export const authorizeOrgAdmin = async (req, res, next) => {
  if (req.user.role !== "ORG_Owner"){
    return res.status(403).json({ message: "Access denied" });
  }
  else{
    const orgId = req.headers.orgid;
    if (!orgId) {
      return res.status(403).json({ message: "Organization ID missing" });
    }
    const userId = req.user.id;
    const ownerExist = await prisma.organization.findUnique({
      where: {
        org_id: orgId, 
        ownerId: userId
      }
    })
    if (!ownerExist) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  }

}