import multer from "multer"

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ]

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false)
    }

    cb(null, true)
  }
})

export default upload