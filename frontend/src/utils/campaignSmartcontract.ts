import { useSendMessage, useTonConnect } from "@d0rich/vueton";
import { Address, Cell, toNano } from "@ton/core";
import { beginCell } from "@ton/core";

const { tonWallet, sendTransaction } = useTonConnect();

const create = (id: bigint, name: string) => {
  const { sendMessage, isFetching, success } = useSendMessage({
    sendMessageFn: async () => {
      if (!tonWallet.value) {
        throw new Error("Wallet not connected");
      }

      const messageCell: Cell = beginCell()
        .storeUint(0x5fd2908f, 32)
        .storeUint(id, 256)
        .storeRef(beginCell().storeStringTail(name).endCell())
        .endCell();

      const smartContractAddress = Address.parse(
        "EQBZ-LJPxYt3NRyaQDx75mh9F2exWOylMt6Sqcv6sgqDQO48"
      );

      await sendTransaction({
        to: smartContractAddress,
        value: toNano("0.05"),
        bounce: true,
        body: messageCell,
      });
    },
  });

  return {
    sendMessage,
    isFetching,
    success,
  };
};

const update = () => {};

const destroy = () => {};

const donate = () => {};

const withdraw = () => {};

export default {
  create,
  update,
  destroy,
  donate,
  withdraw,
};
