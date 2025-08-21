import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Dictionary, toNano } from '@ton/core';
import '@ton/test-utils';
import { CreateCampaign, Donation, ReceiveDonation, WithdrawCampaign } from '../build/Donation/Donation_Donation';

describe('Donation: Withdraw Campaign', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let donation: SandboxContract<Donation>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        donation = blockchain.openContract(await Donation.fromInit(deployer.address, Dictionary.empty(), 0n));

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

    const withdrawCampaign = async (id: bigint, amount: bigint) => {
        const message: WithdrawCampaign = {
            $$type: 'WithdrawCampaign',
            id,
            amount,
            receiverAddress: deployer.address 
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

    it('should be success withdraw campaign', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 1n)]);
        const campaignBeforeWithdrawBalance = await donation.getCampaignBalance(1n);
        await withdrawCampaign(1n, 1n);
        const campaignAfterWithdrawBalance = await donation.getCampaignBalance(1n);
        expect(campaignBeforeWithdrawBalance).toBeGreaterThan(campaignAfterWithdrawBalance);
    });

    it('should be fail withdraw campaign if campaign id not exist', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 1n)]);

        const withdrawCampaignIdNotExist: any = await withdrawCampaign(2n, 1n);
        expect(withdrawCampaignIdNotExist.transactions[1].description.computePhase.exitCode).toBe(134);
    });

    it('should be fail withdraw campaign if withdraw amount is zero', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 1n)]);

        const withdrawCampaignWithZeroAmount: any = await withdrawCampaign(1n, 0n);
        expect(withdrawCampaignWithZeroAmount.transactions[1].description.computePhase.exitCode).toBe(134);
    });
});
