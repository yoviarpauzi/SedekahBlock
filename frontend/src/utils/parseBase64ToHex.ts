const parseBase64ToHex = (base64String: string) => {
  const bytes = Buffer.from(base64String, "base64");
  return bytes.toString("hex");
};

export default parseBase64ToHex;
