import dotenv from 'dotenv';

dotenv.config();

const ownerAddress: string = process.env.OWNER_ADDRESS!;
const contractAddress: string = process.env.CONTRACT_ADDRESS!;

export { ownerAddress, contractAddress };
