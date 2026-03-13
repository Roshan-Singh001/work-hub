import { prisma } from "../config/db.ts"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { uploadDoc } from "../utils/docHandle.js"

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
    const org_id = 'org_' + uuidv4().replaceAll("-", "_");
    const user_id = 'user_' + uuidv4().replaceAll("-", "_");
    const uploaded_url = await uploadDoc(file_path, "org");

    await prisma.user.create({
      data: {
        id: user_id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: "ORG_Owner",
        phone: data.phone,
        organizationId: org_id
      }
    });

    await prisma.organization.create({
      data: {
        org_id: org_id,
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
        id: user_id,
        organizationId: org_id,
        local_role: "Owner",
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

    return { message: "Organization registered successfully, Kindly wait for approval from admin" }
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
        role: "Client",
        status: "approved",
      }
    })

    await prisma.client.create({
      data: {
        client_id: user_id,
        org_name: data?.organization,
        country: data.country,
        phone: data.phone
      }
    })

  }


}