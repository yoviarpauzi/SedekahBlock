import dotenv from "dotenv";

dotenv.config();

const serverURI = import.meta.env.VITE_SERVER_URI;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export { serverURI, contractAddress };
