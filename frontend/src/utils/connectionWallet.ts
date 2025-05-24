import { useTonConnect } from "@d0rich/vueton";
import { generatePayload } from "./generatePayload";

const connectWallet = async () => {
  const { tonConnect } = useTonConnect();
  try {
    tonConnect.setConnectRequestParameters({
      state: "loading",
    });

    const payload = await generatePayload();

    tonConnect.setConnectRequestParameters({
      state: "ready",
      value: {
        tonProof: payload,
      },
    });

    await tonConnect.openModal();
  } catch (err) {
    throw err;
  }
};

export { connectWallet };
