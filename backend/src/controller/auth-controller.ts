import { NextFunction, Request, Response } from "express";
import proofPayload from "../validations/ton-proof-validation";
import crypto from "crypto";
import { accessTokenSecret, feURI } from "../utils/environment";
import { Address, Cell } from "@ton/core";
import { TonClient } from "@ton/ton";
import BN from "bn.js";
import nacl from "tweetnacl";
import ResponseError from "../error/response-error";
import userService from "../services/user-service";
import jwt from "jsonwebtoken";

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

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

// Constants
const WALLET_CODES = {
  V1R1: "te6cckEBAQEARAAAhP8AIN2k8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVEH98Ik=",
  V1R2: "te6cckEBAQEAUwAAov8AIN0gggFMl7qXMO1E0NcLH+Ck8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVNDieG8=",
  V1R3: "te6cckEBAQEAXwAAuv8AIN0gggFMl7ohggEznLqxnHGw7UTQ0x/XC//jBOCk8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVLW4bkI=",
  V2R1: "te6cckEBAQEAVwAAqv8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x8B+CO78mPtRNDTH9P/0VExuvKhA/kBVBBC+RDyovgAApMg10qW0wfUAvsA6NGkyMsfy//J7VShNwu2",
  V2R2: "te6cckEBAQEAYwAAwv8AIN0gggFMl7ohggEznLqxnHGw7UTQ0x/XC//jBOCk8mCDCNcYINMf0x8B+CO78mPtRNDTH9P/0VExuvKhA/kBVBBC+RDyovgAApMg10qW0wfUAvsA6NGkyMsfy//J7VQETNeh",
  V3R1: "te6cckEBAQEAYgAAwP8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVD++buA=",
  V3R2: "te6cckEBAQEAcQAA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVBC9ba0=",
  V4R1: "te6cckECFQEAAvUAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyY+1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8REhMUA+7QAdDTAwFxsJFb4CHXScEgkVvgAdMfIYIQcGx1Z70ighBibG5jvbAighBkc3RyvbCSXwPgAvpAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8F4ATTP8glghBwbHVnupEx4w0kghBibG5juuMABAYHCAIBIAkKAFAB+gD0BDCCEHBsdWeDHrFwgBhQBcsFJ88WUAP6AvQAEstpyx9SEMs/AFL4J28ighBibG5jgx6xcIAYUAXLBSfPFiT6AhTLahPLH1Iwyz8B+gL0AACSghBkc3Ryuo41BIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UghBkc3Rygx6xcIAYUATLBVjPFiL6AhLLassfyz+UEDRfBOLJgED7AAIBIAsMAFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQCAVgNDgARuMl+1E0NcLH4AD2ynftRNCBAUDXIfQEMALIygfL/8nQAYEBCPQKb6ExgAgEgDxAAGa3OdqJoQCBrkOuF/8AAGa8d9qJoQBBrkOuFj8AAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJcfsAyEAUgQEI9FHypwIAbIEBCNcYyFQgJYEBCPRR8qeCEG5vdGVwdIAYyMsFywJQBM8WghAF9eEA+gITy2oSyx/JcfsAAgBygQEI1xgwUgKBAQj0WfKn+CWCEGRzdHJwdIAYyMsFywJQBc8WghAF9eEA+gIUy2oTyx8Syz/Jc/sAAAr0AMntVEap808=",
  V4R2: "te6cckECFAEAAtQAART/APSkE/S88sgLAQIBIAIPAgFIAwYC5tAB0NMDIXGwkl8E4CLXScEgkl8E4ALTHyGCEHBsdWe9IoIQZHN0cr2wkl8F4AP6QDAg+kQByMoHy//J0O1E0IEBQNch9AQwXIEBCPQKb6Exs5JfB+AF0z/IJYIQcGx1Z7qSODDjDQOCEGRzdHK6kl8G4w0EBQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPP ScotsFiP6AhPLassfyz/JgED7AJJfA+ICASAHDgIBIAgNAgFYCQoAPbKd+1E0IEBQNch9AQwAsjKB8v/ydABgQEI9ApvoTGACASALDAAZrc52omhAIGuQ64X/wAAZrx32omhAEGuQ64WPwAARuMl+1E0NcLH4AFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVAj45Sg=",
} as const;

const EXPIRATION_SECONDS = 3600; // 1 hour
const TON_PROOF_PREFIX = "ton-proof-item-v2/";
const TON_CONNECT_PREFIX = "ton-connect";

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

  if (proof.domain.value !== feURI) {
    throw new ResponseError(
      400,
      `wrong domain, got ${proof.domain.value}, expected ${feURI}`
    );
  }

  if (proof.domain.lengthBytes !== proof.domain.value.length) {
    throw new ResponseError(
      400,
      `domain length mismatched against provided length bytes of ${proof.domain.lengthBytes}`
    );
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

const getPublicKey = async (
  client: TonClient,
  address: Address,
  proof: ProofPayload["proof"]
): Promise<Buffer> => {
  const executionRes = await client.runMethodWithError(
    address,
    "get_public_key"
  );

  if (executionRes.exit_code === 0) {
    const pubkeyNum = executionRes.stack.readBigNumber();
    return new BN(pubkeyNum.toString()).toBuffer("be", 32);
  }

  const boc = Cell.fromBase64(proof.state_init);
  const code = boc.refs[0];
  const data = boc.refs[1];
  const version = code.toBoc().toString("base64");

  switch (version) {
    case WALLET_CODES.V1R1:
    case WALLET_CODES.V1R2:
    case WALLET_CODES.V1R3:
    case WALLET_CODES.V2R1:
    case WALLET_CODES.V2R2:
      return data.asSlice().skip(32).loadBuffer(32);
    case WALLET_CODES.V3R1:
    case WALLET_CODES.V3R2:
    case WALLET_CODES.V4R1:
    case WALLET_CODES.V4R2:
      return data.asSlice().skip(64).loadBuffer(32);
    default:
      throw new ResponseError(400, "unsupported wallet version");
  }
};

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

    validatePayload(payload);
    validateProof(proof);

    const parsedAddress = Address.parse(address);
    const client = new TonClient({
      endpoint: `https://${
        network === "testnet" ? "testnet." : ""
      }toncenter.com/api/v2/jsonRPC`,
    });

    const fullMsgHash = createMessageHash(parsedAddress, proof);
    const pubkey = await getPublicKey(client, parsedAddress, proof);
    const proofSignatureBytes = Buffer.from(proof.signature, "base64");

    const verified = nacl.sign.detached.verify(
      fullMsgHash,
      proofSignatureBytes,
      pubkey
    );

    if (!verified) {
      throw new ResponseError(400, "verification failed");
    }

    let user = await userService.getUserByWallet(address);

    if (!user) {
      user = await userService.create(address);
    }

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      accessTokenSecret!,
      { expiresIn: "1d" }
    );

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({
        status: "success",
        message: "successfully authenticated",
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

    res.status(200).json({
      status: "success",
      message: "successfully generated payload",
      payload: Buffer.concat([payload, signature])
        .subarray(0, 32)
        .toString("hex"),
    });
  } catch (err) {
    next(err);
  }
};

export default {
  authenticate,
  generatePayload,
};
