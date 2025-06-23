import { Cell, Address, beginCell, storeMessage, TonClient } from "@ton/ton";

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

// Simple retry function implementation
async function retry(fn, options = {}) {
  const { retries = 3, delay = 1000 } = options;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries) {
        throw error;
      }
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function getTxByBOC(exBoc) {
  const myAddress = Address.parse(
    "0QBEsW5QAOSjha2T2a6PKpVet2H5ToDg1f06P_VkQZUMnUQ3"
  );

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
            console.log("Invalid external message, skipping...");
            continue; // Fixed: removed incorrect reject() call
          }

          const extHash = Cell.fromBase64(exBoc).hash().toString("hex");
          const inHash = beginCell()
            .store(storeMessage(inMsg))
            .endCell()
            .hash()
            .toString("hex");

          console.log("External BOC hash:", extHash);
          console.log("InMsg hash:", inHash);
          console.log("Checking transaction:", tx.hash().toString("hex"));

          if (extHash === inHash) {
            console.log("Transaction match found!");
            const txHash = tx.hash().toString("hex");
            console.log(`Transaction Hash: ${txHash}`);
            console.log(`Transaction LT: ${tx.lt}`);
            return txHash;
          }
        }
      }
      throw new Error("Transaction not found");
    },
    { retries: 30, delay: 1000 }
  );
}

const txRes = await getTxByBOC(
  "te6cckEBBAEA3wAB5YgAiWLcoAHJRwtbJ7NdHlUqvW7D8p0Bwav6dH/qyIMqGToDm0s7c////+tCrmjIAAAHFAs4kwrNsLVtBvBZSEUjznawm+CZTqEBk3DoopY4gU39imVt6fjkEpwJIX5NN7cX+dgqHV6QRenZ67GwFEJPPBcBAgoOw8htAwMCALhiACVQTCX8FppEGS8xsSYaQWQFbs0iYPUTen97j6huD3GYII8NGAAAAAAAAAAAAAAAAAAAbfVAXgAAAC0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEeGjAAAAos0+dg=="
);
console.log("Final result:", txRes);
