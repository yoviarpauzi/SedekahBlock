import axios from "axios";

const generatePayload = async () => {
  const res = await axios.get("http://localhost:3000/api/generate-payload");

  return res.data.payload;
};

export { generatePayload };
