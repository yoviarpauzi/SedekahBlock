import axios from "axios";
import parseBase64ToHex from "./parseBase64ToHex";

const getLastTransactionsLink = async (userAddress: string) => {
  const res = await axios.get(
    `https://testnet.toncenter.com/api/v2/getTransactions?address=${userAddress}&limit=1&archival=true`
  );

  const data = res.data.result[0];
  const transactionHash = parseBase64ToHex(data.transaction_id.hash);
  return `https://testnet.tonviewer.com/transaction/${transactionHash}`;
};

export default getLastTransactionsLink;
