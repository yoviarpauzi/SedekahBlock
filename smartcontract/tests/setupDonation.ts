import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Donation } from '../wrappers/Donation';
import { toNano } from '@ton/core';

let initialized = false;
let blockchain: Blockchain;
let deployer: SandboxContract<TreasuryContract>;
let donation: SandboxContract<Donation>;

export const setup = async () => {
    if (!initialized) {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        donation = blockchain.openContract(await Donation.fromInit(deployer.address));

        const deployResult = await donation.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        const success = deployResult.transactions.some(
            (tx) =>
                tx.description?.type === 'generic' &&
                tx.description.computePhase.type === 'vm' &&
                tx.description.computePhase.success,
        );

        if (!success) {
            throw new Error('Failed to deploy Donation contract');
        }

        initialized = true;
    }

    return { blockchain, deployer, donation };
};
