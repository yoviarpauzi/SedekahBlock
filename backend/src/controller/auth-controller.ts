import { NextFunction, Request, Response } from "express";
import proofPayload from "../validations/ton-proof-validation";
import crypto from "crypto";
import { accessTokenSecret, feURI } from "../utils/environment";
import { Address, Cell, loadStateInit, contractAddress } from "@ton/core";
import { TonClient } from "@ton/ton";
import BN from "bn.js";
import nacl from "tweetnacl";
import ResponseError from "../error/response-error";
import userService from "../services/user-service";
import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma";
import {
  Slice,
  StateInit,
  WalletContractV1R1,
  WalletContractV1R2,
  WalletContractV1R3,
  WalletContractV2R1,
  WalletContractV2R2,
  WalletContractV3R1,
  WalletContractV3R2,
  WalletContractV4 as WalletContractV4R2,
  WalletContractV5Beta,
  WalletContractV5R1,
} from "@ton/ton";
import { Buffer } from "buffer";

interface ProofPayload {
  proof: {
    payload: string;
    timestamp: number;
    domain: { value: string; lengthBytes: number };
    signature: string;
    state_init: string;
  };
  address: string;
  network: string;
}

// WalletContractV4R1 implementation
class WalletContractV4R1 {
  static create(args: {
    workchain: number;
    publicKey: Buffer;
    walletId?: number | null;
  }) {
    const wallet = WalletContractV4R2.create(args);
    const { data } = wallet.init;
    const code = Cell.fromBoc(
      Buffer.from(
        "B5EE9C72410215010002F5000114FF00F4A413F4BCF2C80B010201200203020148040504F8F28308D71820D31FD31FD31F02F823BBF263ED44D0D31FD31FD3FFF404D15143BAF2A15151BAF2A205F901541064F910F2A3F80024A4C8CB1F5240CB1F5230CBFF5210F400C9ED54F80F01D30721C0009F6C519320D74A96D307D402FB00E830E021C001E30021C002E30001C0039130E30D03A4C8CB1F12CB1FCBFF1112131403EED001D0D3030171B0915BE021D749C120915BE001D31F218210706C7567BD228210626C6E63BDB022821064737472BDB0925F03E002FA403020FA4401C8CA07CBFFC9D0ED44D0810140D721F404305C810108F40A6FA131B3925F05E004D33FC8258210706C7567BA9131E30D248210626C6E63BAE30004060708020120090A005001FA00F404308210706C7567831EB17080185005CB0527CF165003FA02F40012CB69CB1F5210CB3F0052F8276F228210626C6E63831EB17080185005CB0527CF1624FA0214CB6A13CB1F5230CB3F01FA02F4000092821064737472BA8E3504810108F45930ED44D0810140D720C801CF16F400C9ED54821064737472831EB17080185004CB0558CF1622FA0212CB6ACB1FCB3F9410345F04E2C98040FB000201200B0C0059BD242B6F6A2684080A06B90FA0218470D4080847A4937D29910CE6903E9FF9837812801B7810148987159F31840201580D0E0011B8C97ED44D0D70B1F8003DB29DFB513420405035C87D010C00B23281F2FFF274006040423D029BE84C600201200F100019ADCE76A26840206B90EB85FFC00019AF1DF6A26840106B90EB858FC0006ED207FA00D4D422F90005C8CA0715CBFFC9D077748018C8CB05CB0222CF165005FA0214CB6B12CCCCC971FB00C84014810108F451F2A702006C810108D718C8542025810108F451F2A782106E6F746570748018C8CB05CB025004CF16821005F5E100FA0213CB6A12CB1FC971FB00020072810108D718305202810108F459F2A7F82582106473747270748018C8CB05CB025005CF16821005F5E100FA0214CB6A13CB1F12CB3FC973FB00000AF400C9ED5446A9F34F",
        "hex"
      )
    )[0]!;
    (wallet as any).init = { data, code };
    (wallet as any).address = contractAddress(args.workchain, wallet.init);
    return wallet;
  }
}

// Wallet data loading functions
function loadWalletV1Data(cs: Slice) {
  const seqno = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  return { seqno, publicKey };
}

function loadWalletV2Data(cs: Slice) {
  const seqno = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  return { seqno, publicKey };
}

function loadWalletV3Data(cs: Slice) {
  const seqno = cs.loadUint(32);
  const walletId = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  return { seqno, publicKey, walletId };
}

function loadWalletV4Data(cs: Slice) {
  const seqno = cs.loadUint(32);
  const walletId = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  const plugins = cs.loadMaybeRef();
  return { seqno, publicKey, walletId, plugins };
}

function loadWalletV5BetaData(cs: Slice) {
  const isSignatureAuthAllowed = cs.loadBoolean();
  const seqno = cs.loadUint(32);
  const walletId = cs.loadUintBig(80);
  const publicKey = cs.loadBuffer(32);
  const plugins = cs.loadMaybeRef();
  return { isSignatureAuthAllowed, seqno, publicKey, walletId, plugins };
}

function loadWalletV5Data(cs: Slice) {
  const isSignatureAuthAllowed = cs.loadBoolean();
  const seqno = cs.loadUint(32);
  const walletId = cs.loadUint(32);
  const publicKey = cs.loadBuffer(32);
  const plugins = cs.loadMaybeRef();
  return { isSignatureAuthAllowed, seqno, publicKey, walletId, plugins };
}

// Known wallets configuration
const knownWallets = [
  { contract: WalletContractV1R1, loadData: loadWalletV1Data },
  { contract: WalletContractV1R2, loadData: loadWalletV1Data },
  { contract: WalletContractV1R3, loadData: loadWalletV1Data },
  { contract: WalletContractV2R1, loadData: loadWalletV2Data },
  { contract: WalletContractV2R2, loadData: loadWalletV2Data },
  { contract: WalletContractV3R1, loadData: loadWalletV3Data },
  { contract: WalletContractV3R2, loadData: loadWalletV3Data },
  { contract: WalletContractV4R1, loadData: loadWalletV4Data },
  { contract: WalletContractV4R2, loadData: loadWalletV4Data },
  { contract: WalletContractV5Beta, loadData: loadWalletV5BetaData },
  { contract: WalletContractV5R1, loadData: loadWalletV5Data },
].map(({ contract, loadData }) => ({
  contract: contract,
  loadData: loadData,
  wallet: contract.create({ workchain: 0, publicKey: Buffer.alloc(32) }),
}));

// Constants
const EXPIRATION_SECONDS = 3600; // 1 hour
const TON_PROOF_PREFIX = "ton-proof-item-v2/";
const TON_CONNECT_PREFIX = "ton-connect";
const allowedDomains = ["localhost:5173", "sedekahblock.adaai.id", feURI];
const validAuthTime = 15 * 60; // 15 minute

// Improved tryParsePublicKey function
function tryParsePublicKey(stateInit: StateInit): Buffer | null {
  if (!stateInit.code || !stateInit.data) {
    return null;
  }

  for (const { wallet, loadData } of knownWallets) {
    if (wallet.init.code.equals(stateInit.code)) {
      return loadData(stateInit.data.beginParse()).publicKey;
    }
  }

  return null;
}

// Utility functions
const createHmacSignature = (data: Buffer): Buffer => {
  return crypto.createHmac("sha256", accessTokenSecret!).update(data).digest();
};

const validatePayload = (payload: Buffer): { expireTime: bigint } => {
  if (payload.length !== 32) {
    throw new ResponseError(
      400,
      `invalid payload length, got ${payload.length}, expected 32`
    );
  }

  const signatureValid = payload
    .subarray(16)
    .equals(createHmacSignature(payload.subarray(0, 16)).subarray(0, 16));

  if (!signatureValid) {
    throw new ResponseError(400, "invalid payload signature");
  }

  const now = Math.floor(Date.now() / 1000);
  const expireTime = payload.subarray(8, 16).readBigUint64BE();

  if (BigInt(now) > expireTime) {
    throw new ResponseError(400, "payload expired");
  }

  return { expireTime };
};

const validateProof = (proof: ProofPayload["proof"]): void => {
  const now = Math.floor(Date.now() / 1000);
  if (now > proof.timestamp + EXPIRATION_SECONDS) {
    throw new ResponseError(400, "TON proof has expired");
  }

  // Check if domain is in allowed domains list
  if (!allowedDomains.includes(proof.domain.value)) {
    throw new ResponseError(
      400,
      `domain not allowed, got ${
        proof.domain.value
      }, expected one of: ${allowedDomains.join(", ")}`
    );
  }

  if (proof.domain.lengthBytes !== proof.domain.value.length) {
    throw new ResponseError(
      400,
      `domain length mismatched against provided length bytes of ${proof.domain.lengthBytes}`
    );
  }

  // Additional time validation for better security
  if (now - validAuthTime > proof.timestamp) {
    throw new ResponseError(400, "proof timestamp is too old");
  }
};

const createMessageHash = (
  address: Address,
  proof: ProofPayload["proof"]
): Buffer => {
  const wc = Buffer.alloc(4);
  wc.writeInt32BE(address.workChain);
  const ts = Buffer.alloc(8);
  ts.writeBigUint64LE(BigInt(proof.timestamp));
  const dl = Buffer.alloc(4);
  dl.writeUint32LE(proof.domain.value.length);

  const msg = Buffer.concat([
    Buffer.from(TON_PROOF_PREFIX),
    wc,
    address.hash,
    dl,
    Buffer.from(proof.domain.value),
    ts,
    Buffer.from(proof.payload),
  ]);

  const msgHash = crypto.createHash("sha256").update(msg).digest();
  const fullMsg = Buffer.concat([
    Buffer.from([0xff, 0xff]),
    Buffer.from(TON_CONNECT_PREFIX),
    msgHash,
  ]);

  return crypto.createHash("sha256").update(fullMsg).digest();
};

// Improved getPublicKey function using the new approach
const getPublicKey = async (
  client: TonClient,
  address: Address,
  proof: ProofPayload["proof"]
): Promise<Buffer> => {
  try {
    // 1. First, try to obtain public key via get_public_key get-method on smart contract deployed at Address
    const executionRes = await client.runMethodWithError(
      address,
      "get_public_key"
    );

    if (executionRes.exit_code === 0) {
      const pubkeyNum = executionRes.stack.readBigNumber();
      return new BN(pubkeyNum.toString()).toBuffer("be", 32);
    }
  } catch (error) {
    console.log(
      "get_public_key method failed, trying state_init parsing:",
      error
    );
  }

  // 2. If the smart contract is not deployed yet, or the get-method is missing,
  // parse state_init and get public key from it
  try {
    const stateInit = loadStateInit(
      Cell.fromBase64(proof.state_init).beginParse()
    );

    // Use the improved tryParsePublicKey function
    const publicKey = tryParsePublicKey(stateInit);

    if (publicKey) {
      return publicKey;
    }

    throw new ResponseError(
      400,
      "unable to extract public key from state_init"
    );
  } catch (error) {
    throw new ResponseError(
      400,
      "failed to extract public key from state_init"
    );
  }
};

// Enhanced authenticate function
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { proof, address, network } = proofPayload.parse(
      req.body
    ) as ProofPayload;
    const payload = Buffer.from(proof.payload, "hex");

    // Validate payload
    validatePayload(payload);

    // Validate proof with enhanced checks
    validateProof(proof);

    const parsedAddress = Address.parse(address);
    const client = new TonClient({
      endpoint: `https://${
        network === "testnet" ? "testnet." : ""
      }toncenter.com/api/v2/jsonRPC`,
    });

    // Create message hash
    const fullMsgHash = createMessageHash(parsedAddress, proof);

    // Get public key with improved method
    const pubkey = await getPublicKey(client, parsedAddress, proof);

    const proofSignatureBytes = Buffer.from(proof.signature, "base64");

    // Verify signature
    const verified = nacl.sign.detached.verify(
      fullMsgHash,
      proofSignatureBytes,
      pubkey
    );

    if (!verified) {
      throw new ResponseError(400, "signature verification failed");
    }

    // Additional validation: Check if address matches state_init
    try {
      const stateInit = loadStateInit(
        Cell.fromBase64(proof.state_init).beginParse()
      );
      const derivedAddress = contractAddress(
        parsedAddress.workChain,
        stateInit
      );

      if (!derivedAddress.equals(parsedAddress)) {
        throw new ResponseError(400, "address does not match state_init");
      }
    } catch (error) {
      throw new ResponseError(400, "address validation failed");
    }

    // Get or create user
    let user = await userService.getUserByWallet(address);

    if (!user) {
      user = await userService.create(address);
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        address: address,
        network: network,
      },
      accessTokenSecret!,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .json({
        status: "success",
        message: "success authentication",
      });
  } catch (err) {
    next(err);
  }
};

const generatePayload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const randomBytes = crypto.randomBytes(8);
    const expirationTimestamp = BigInt(
      Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS
    );
    const expirationBuffer = Buffer.alloc(8);
    expirationBuffer.writeBigInt64BE(expirationTimestamp);

    const payload = Buffer.concat([randomBytes, expirationBuffer]);
    const signature = createHmacSignature(payload);

    const finalPayload = Buffer.concat([payload, signature])
      .subarray(0, 32)
      .toString("hex");

    res.status(200).json({
      status: "success",
      message: "payload generated successfully",
      payload: finalPayload,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  authenticate,
  generatePayload,
};
