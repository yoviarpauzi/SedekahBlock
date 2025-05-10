import axios from "axios";
import { serverURI } from "./environment";

const generatePayload = async () => {
  const res = await axios.get(`${serverURI}/api/generate-payload`);
  return res.data.payload;
};

export { generatePayload };
