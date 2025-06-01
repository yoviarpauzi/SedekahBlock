import dotenv from 'dotenv';

dotenv.config();

const ownerAddress = process.env.OWNER_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESS;

export { ownerAddress, contractAddress };
