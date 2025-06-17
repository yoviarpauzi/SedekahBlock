import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreateCampaign, Donation, ReceiveDonation, TransferBalance, WithdrawCampaign } from '../wrappers/Donation';
import '@ton/test-utils';

describe('Donation: Delete Campaign', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let donation: SandboxContract<Donation>;

    beforeEach(async () => {
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

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: donation.address,
            deploy: true,
            success: true,
        });
    });

    const createCampaign = async (id: bigint) => {
        const message: CreateCampaign = {
            $$type: 'CreateCampaign',
            id,
        };

        return await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
            },
            message,
        );
    };

    const donateCampaign = async (id: bigint, amount: bigint) => {
        const message: ReceiveDonation = {
            $$type: 'ReceiveDonation',
            id,
            amount,
        };

        return await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.5) + toNano(amount),
            },
            message,
        );
    };

    const transferBalance = async (id: bigint, toId: bigint, amount: bigint) => {
        const message: TransferBalance = {
            $$type: 'TransferBalance',
            id,
            toId,
            amount,
        };

        return await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.5),
            },
            message,
        );
    };

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and donation are ready to use
    });

    it('should be success transfer campaign balance', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 3n), createCampaign(2n)]);

        await transferBalance(1n, 2n, 2n);
        const campaign1Balance = await donation.getCampaignBalance(1n);
        const campaign2Balance = await donation.getCampaignBalance(2n);
        expect(campaign1Balance).toBe(1n);
        expect(campaign2Balance).toBe(2n);
    });

    it('should be fail transfer campaign balance if sender id not found', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 3n), createCampaign(2n)]);

        const transferSenderCampaignNotExistId: any = await transferBalance(3n, 1n, 2n);
        expect(transferSenderCampaignNotExistId.transactions[1].description.computePhase.exitCode).toBe(134);
    });

    it('should be fail transfer campaign balance if receiver id not found', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 3n), createCampaign(2n)]);

        const transferReceiverCampaignNotExistId: any = await transferBalance(3n, 1n, 4n);
        expect(transferReceiverCampaignNotExistId.transactions[1].description.computePhase.exitCode).toBe(134);
    });

    it('should be fail transfer campaign balance if sender balance to be less than id transfer amount', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 3n), createCampaign(2n)]);

        const transferWithGreaterThanReceiverCampaignBalance: any = await transferBalance(1n, 2n, 4n);
        expect(transferWithGreaterThanReceiverCampaignBalance.transactions[1].description.computePhase.exitCode).toBe(
            37,
        );
    });
});
