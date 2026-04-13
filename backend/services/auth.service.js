import { prisma } from "../config/db.ts"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { uploadDoc } from "../utils/docHandle.js"
import { generateToken, verifyToken } from "../utils/generateToken.js"

export const register = async (req) => {
  const data = req.body;

  console.log("data: ", data);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (existingUser) {
    throw new Error("Email already exists")
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  if (data.role == 'orgs') {

    const file_path = req?.file.path;
    const orgId = 'org_' + uuidv4().replaceAll("-", "_");
    const user_id = 'user_' + uuidv4().replaceAll("-", "_");
    const mem_id = 'mem_' + uuidv4().replaceAll("-", "_");
    const uploaded_url = await uploadDoc(file_path, "org");

    await prisma.user.create({
      data: {
        id: user_id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: "ORG_Owner",
        status: "Pending",
        phone: data.phone,
        organizationId: orgId
      }
    });

    await prisma.organization.create({
      data: {
        org_id: orgId,
        org_name: data.orgName,
        about: data.about,
        website: data?.website,
        ownerId: user_id,
        size: data.companySize,
        license_url: uploaded_url,
        industry: data.industry,
        country: data.country,
      }
    })

    await prisma.org_member.create({
      data: {
        id: mem_id,
        userId: user_id,
        organizationId: orgId,
        role: "Owner",
        status: "Active",
      }
    })

    return { message: "Organization registered successfully, Kindly wait for approval from admin. You can see the status in your dashboard." }
  }
  else if (data.role == 'freelancer') {
    const file_path = req?.file.path;
    const uploaded_url = await uploadDoc(file_path, "freelancer");
    const user_id = 'user_' + uuidv4().replaceAll("-", "_");

    await prisma.user.create({
      data: {
        id: user_id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: "Freelancer",
        phone: data.phone,
      }
    });

    await prisma.freelancer.create({
      data: {
        freelancer_id: user_id,
        title: data.professionalTitle,
        about: data.about,
        country: data.country,
        skills_category: data.skillCategory,
        resume_url: uploaded_url,
      }
    })

    return { message: "Your are registered successfully, Kindly wait for approval from admin, You can view the status in your dashboard." }
  }
  else if(data.role == 'client'){
    const user_id = 'user_' + uuidv4().replaceAll("-", "_");

    await prisma.user.create({
      data: {
        id: user_id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: "Client",
        status: "Active",
      }
    })

    await prisma.client.create({
      data: {
        client_id: user_id,
        org_name: data?.organization,
        country: data.country,
      }
    })

    return { message: "Your are registered successfully" }

  }
}

export const login = async (data) =>{
  console.log("Login request data: ", data);
  const { role, email, password} = data;
  var user;

  if (role == 'Orgs') {
    user = await prisma.user.findUnique({
      where:{
        email: email,
      }
    })
  }
  else if(role == 'Admin'){
    user = await prisma.admin.findUnique({
      where:{
        email: email,
      }
    })
  }
  else{
    user = await prisma.user.findUnique({
      where:{
        email: email,
        role: role
      }
    })
  }

  console.log("user: ",user);

  if (!user) {
    throw new Error("Invalid email or role");
  }

  const isPassValid = await bcrypt.compare(password, user.password);
  if(!isPassValid){
    throw new Error("Invalid Password");
  }

  const token = generateToken(user.id, role == 'Admin' ? 'Admin': user.role);

  return {message: "Login Successful", id: user.id, token: token, role: role == 'Admin' ? "Admin" : user.role}
  
}

export const me = async (data) =>{
  const token = data.cookies.token;
  console.log("Me request data: ", data.cookies);

  if(!token){
    throw new Error("Not authenticated");
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  if (decoded.role == "Admin") {
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id}
    })

    if (!admin) {
      throw new Error("Admin not found");
    }
    return {
      message: "Authenticated Successfully", 
      user: {
        id: decoded.id, 
        name: admin.name, 
        email: admin.email, 
        role: decoded.role
      }}
  }
  else if (decoded.role == "ORG_Owner" || decoded.role == "ORG_Member") {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id}
    })

    const org = await prisma.organization.findUnique({
      where: { org_id: user.organizationId}
    })

    if (!user || !org) {
      throw new Error("User or Organization not found");
    }
    return {
      message: "Authenticated Successfully", 
      user: {
        id: decoded.id, 
        name: user.first_name + " " + user.last_name, 
        email: user.email, 
        role: decoded.role, 
        orgName: org.org_name, 
        orgId: org.org_id,
        status: user.status,
      }
    }

  }
  else if(decoded.role == "Freelancer" || decoded.role == "Client"){
    const user = await prisma.user.findUnique({
      where: { id: decoded.id}
    })

    return {
      message: "Authenticated Successfully", 
      user: {
        id: decoded.id, 
        name: user.first_name + " " + user.last_name,
        email: user.email,
        role: decoded.role,
        status: user.status,
      }}
  }

  
}