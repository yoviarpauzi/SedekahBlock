import prisma from "../config/database";

const create = async (wallet_address: string) => {
  try {
    return await prisma.user.create({
      data: {
        wallet_address: wallet_address,
      },
    });
  } catch (err) {
    throw err;
  }
};

const update = async (id: number, name: string, file: string) => {
  try {
    const isUserExist = await getUserById(id);

    if (isUserExist) {
      return await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          profile_picture: file,
        },
      });
    }
  } catch (err) {
    throw err;
  }
};

const updateProfilePicture = async (id: number, profile_picture: string) => {
  try {
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
  } catch (err) {
    throw err;
  }
};

const getUserByWallet = async (wallet_address: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { wallet_address },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const getAllUser = async (query: any, limit: number = 5) => {
  query.page = Number(query.page) ?? 1;
  const skip = (query.page - 1) * limit;

  const where: {
    name?: { contains: string; mode: "insensitive" };
  } = {
    ...(query.search && {
      name: {
        contains: query.search,
        mode: "insensitive",
      },
    }),
  };

  const [users, rowCount] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, where }),
    prisma.user.count({ where }),
  ]);

  return [users, rowCount];
};

export default {
  create,
  update,
  updateProfilePicture,
  getUserByWallet,
  getUserById,
  getAllUser,
};
