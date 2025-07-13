import { Cell, Address, beginCell, storeMessage, TonClient } from "@ton/ton";

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  //   apiKey: tonApiKey,
});

async function retry(
  fn: () => Promise<any>,
  options: { retries: number; delay: number }
) {
  const { retries = 3, delay = 1500 } = options;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function getLastTransactionsLink(
  exBoc: string,
  walletAddress: string
) {
  const myAddress = Address.parse(walletAddress);

  return retry(
    async () => {
      const transactions = await client.getTransactions(myAddress, {
        limit: 5,
      });

      for (const tx of transactions) {
        const inMsg = tx.inMessage;
        if (inMsg?.info.type === "external-in") {
          const inBOC = inMsg?.body;
          if (typeof inBOC === "undefined") {
            continue;
          }

          const extHash = Cell.fromBase64(exBoc).hash().toString("hex");
          const inHash = beginCell()
            .store(storeMessage(inMsg))
            .endCell()
            .hash()
            .toString("hex");

          if (extHash === inHash) {
            const txHash = tx.hash().toString("hex");
            return `https://testnet.tonviewer.com/transaction/${txHash}`;
          }
        }
      }
      throw new Error("Transaction not found");
    },
    { retries: 30, delay: 1500 }
  );
}

export default getLastTransactionsLink;
