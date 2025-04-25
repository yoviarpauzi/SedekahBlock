import { useTonConnect } from "@d0rich/vueton";
import { generatePayload } from "./tonProof";

const connectWallet = async () => {
  try {
    const { tonConnect } = useTonConnect();
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
    console.log(err);
  }
};

export default connectWallet;
