import axios from "axios";
import parseBase64ToHex from "./parseBase64ToHex";

const getLastTransactionsLink = async (
  userAddress: string,
  amount: number,
  retries = 15,
  delay = 1000
): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    const res = await axios.get(
      `https://testnet.toncenter.com/api/v2/getTransactions?address=${userAddress}&limit=1`
    );

    const data = res.data.result[0];
    const transactionAmount = Number(data.out_msgs[0]?.value) / 1_000_000_000;

    if (transactionAmount === amount) {
      const transactionHash = parseBase64ToHex(data.transaction_id.hash);
      return `https://testnet.tonviewer.com/transaction/${transactionHash}`;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Transaksi dengan jumlah yang sesuai tidak ditemukan.");
};

export default getLastTransactionsLink;
