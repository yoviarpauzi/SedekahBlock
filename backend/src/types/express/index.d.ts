declare namespace Express {
  interface Request {
    user?: {
      id: number;
      role: "ADMIN" | "USER";
      name: string;
      profile_picture: string;
      wallet_address: string;
    };
  }
}
