import dotenv from "dotenv";

dotenv.config();

const serverURI = import.meta.env.VITE_SERVER_URI;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const tonApiKey = import.meta.env.VITE_TON_API_KEY;

export { serverURI, contractAddress, tonApiKey };
