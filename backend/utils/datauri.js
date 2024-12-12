import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toLowerCase();  // Normalize to lower case
    if (!allowedExtensions.includes(extName)) {
        throw new Error("Invalid file type. Only images are allowed.");
    }

    return parser.format(extName, file.buffer).content;
};

export default getDataUri;
