import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
    secure: true,
});

export const uploadDoc = async (file, folder) => {
    const options = {
        folder: "work-hub/" + folder,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: "auto",
    };

    try {
        const result = await cloudinary.v2.uploader.upload(file, options);
        console.log(result);
        return result.secure_url;

    } catch (error) {
        console.error(error);
    }

}