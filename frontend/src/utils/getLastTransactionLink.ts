import TonWeb from "tonweb";

async function getLastTransactionLink(exBoc: string): Promise<string> {
  const maxRetries = 20;
  const retryDelay = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const cell = TonWeb.boc.Cell.oneFromBoc(
        TonWeb.utils.base64ToBytes(exBoc)
      );
      const hash = await cell.hash();
      const hashHex = TonWeb.utils.bytesToHex(hash);

      const response = await fetch(
        `https://testnet.tonapi.io/v2/blockchain/messages/${hashHex}/transaction`
      );

      const transactionData = await response.json();

      if (!transactionData || !transactionData.hash) {
        throw new Error("Transaction data is undefined or invalid");
      }

      return `https://testnet.tonviewer.com/transaction/${transactionData.hash}`;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          `Failed to get transaction after ${maxRetries} attempts: ${error}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error("Unexpected error in retry loop");
}

export default getLastTransactionLink;
