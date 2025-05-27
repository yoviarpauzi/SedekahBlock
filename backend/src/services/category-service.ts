import prisma from "../config/database";
import ResponseError from "../error/response-error";

const create = async (name: string) => {
  try {
    const isExists = await isCategoryNameExist(name);

    if (isExists) {
      throw new ResponseError(409, "category name is already exist");
    }

    return await prisma.category.create({
      data: {
        name: name,
      },
    });
  } catch (err) {
    throw err;
  }
};

const update = async (id: number, name: string) => {
  try {
    const isExists = await isCategoryNameExist(name);

    if (isExists) {
      throw new ResponseError(409, "category name is already exist");
    }

    const isIdExist = await getCategory(id);

    if (!isIdExist) {
      throw new ResponseError(404, "category id not found");
    }

    return await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
  } catch (err) {
    throw err;
  }
};

const getCategory = async (id: number) => {
  try {
    return await prisma.category.findUnique({
      where: {
        id: id,
      },
    });
  } catch (err) {
    throw err;
  }
};

const getAllCategory = async () => {
  const [category, rowCount] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            campaigns: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.category.count({}),
  ]);

  return [category, rowCount];
};

const destroy = async (id: number) => {
  try {
    const isCategoryIdExists = await getCategory(id);

    if (!isCategoryIdExists) {
      throw new ResponseError(404, "category id not found");
    }

    return await prisma.category.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    throw err;
  }
};

const isCategoryNameExist = async (name: string): Promise<boolean> => {
  try {
    const isNameExists = await prisma.category.findUnique({
      where: {
        name: name,
      },
    });

    if (isNameExists) {
      return true;
    }

    return false;
  } catch (err) {
    throw err;
  }
};

export default {
  create,
  update,
  getCategory,
  getAllCategory,
  isCategoryNameExist,
  destroy,
};
