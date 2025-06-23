import tonWeb from "tonweb";
import { contractAddress } from "./environment";

const provider = new tonWeb.HttpProvider(
  "https://testnet.toncenter.com/api/v2/jsonRPC",
  {
    apiKey: "c35b86555f402afdc7d39c2dc66bf5bf52df543a9cd66c2346b0efe1732e07ca",
  }
);

const contract = new tonWeb.Contract(provider, {
  address: contractAddress,
});

const getContractBalance = async () => {
  const balance = await contract.provider.getBalance(contractAddress);
  return (balance / 1e9).toFixed(2);
};

const getTotalCampaign = async () => {
  const response = await contract.provider.call(
    contractAddress,
    "totalCampaign"
  );

  const hexValue = response.stack[0][1];
  const totalCampaign = parseInt(hexValue, 16);
  return totalCampaign;
};

const getCampaignBalance = async (id: number) => {
  const campaignIdHex = "0x" + BigInt(id).toString(16);
  const params: [string, any][] = [["num", campaignIdHex]];

  const response = await contract.provider.call(
    contractAddress,
    "campaignBalance",
    params
  );

  const hexValue = response.stack[0][1];
  const balance = (parseInt(hexValue, 16) / 1e9).toFixed(2);

  return balance;
};

const isCampaignExist = async (id: number) => {
  const campaignIdHex = "0x" + BigInt(id).toString(16);

  const params: [string, any][] = [["num", campaignIdHex]];

  const response = await contract.provider.call(
    contractAddress,
    "isCampaignExist",
    params
  );

  const boolHex = response.stack[0][1];

  const exists = boolHex === "-0x1";

  return exists;
};

export default {
  getContractBalance,
  getTotalCampaign,
  getCampaignBalance,
  isCampaignExist,
};
