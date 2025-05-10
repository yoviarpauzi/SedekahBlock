import axios from "axios";

const getTonPrice = async () => {
  const res = await axios.get(
    "https://tonapi.io/v2/rates?tokens=ton&currencies=idr"
  );
  return res.data.rates.TON.prices.IDR;
};

export default getTonPrice;
