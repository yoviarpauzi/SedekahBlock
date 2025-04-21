import prisma from "../config/database";
import ResponseError from "../error/response-error";

const create = async (wallet_address: string) => {
  return await prisma.user.create({
    data: {
      wallet_address: wallet_address,
    },
  });
};

const update = async (id: number, user: { name: string; email: string }) => {
  const isUserExist = await getUserById(id);

  if (isUserExist) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: user.name,
        email: user.email,
      },
    });
  }
};

const updateProfilePicture = async (id: number, profile_picture: string) => {
  const isUserExist = await getUserById(id);

  if (isUserExist) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profile_picture: profile_picture,
      },
    });
  }
};

const getUserByWallet = async (wallet_address: string) => {
  const user = await prisma.user.findUnique({
    where: { wallet_address },
  });

  if (!user) {
    throw new ResponseError(404, "user not found");
  }

  return user;
};

const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ResponseError(404, "user not found");
  }

  return user;
};

const getAllUser = async () => {
  return await prisma.user.findMany({});
};

export default {
  create,
  update,
  updateProfilePicture,
  getUserByWallet,
  getUserById,
  getAllUser,
};
