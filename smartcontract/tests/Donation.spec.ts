import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreateCampaign, DeleteCampaign, Donation, ReceiveDonation, WithdrawCampaign } from '../wrappers/Donation';
import '@ton/test-utils';
import { create } from 'domain';

describe('Donation', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let donation: SandboxContract<Donation>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        const deployerAddress = deployer.address;

        donation = blockchain.openContract(await Donation.fromInit(deployerAddress));

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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and donation are ready to use
    });

    it('should create campaign', async () => {
        const createMessage: CreateCampaign = {
            $$type: 'CreateCampaign',
            id: 1n,
        };

        const createMessage2: CreateCampaign = {
            $$type: 'CreateCampaign',
            id: 2n,
        };

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
            },
            createMessage,
        );

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
            },
            createMessage2,
        );

        const totalCampaign = await donation.getTotalCampaign();
        const campaign1Exist = await donation.getIsCampaignExist(1n);
        const campaign2Exist = await donation.getIsCampaignExist(2n);

        expect(totalCampaign).toBe(2n);
        expect(campaign1Exist).toBeTruthy();
        expect(campaign2Exist).toBeTruthy();
    });

    it('should receive donation', async () => {
        const createMessage: CreateCampaign = {
            $$type: 'CreateCampaign',
            id: 1n,
        };

        const donateMessage: ReceiveDonation = {
            $$type: 'ReceiveDonation',
            id: 1n,
            amount: 1n,
        };

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
                bounce: true,
            },
            createMessage,
        );

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(1.05),
                bounce: true,
            },
            donateMessage,
        );

        const campaignBalance = await donation.getCampaignBalance(1n);
        expect(campaignBalance).toBe(1n);
    });

    it('should withdraw campaign', async () => {
        const createMessage: CreateCampaign = {
            $$type: 'CreateCampaign',
            id: 1n,
        };

        const donateMessage: ReceiveDonation = {
            $$type: 'ReceiveDonation',
            id: 1n,
            amount: toNano(1),
        };

        const withdrawMessage: WithdrawCampaign = {
            $$type: 'WithdrawCampaign',
            id: 1n,
            amount: toNano(1),
        };

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
                bounce: true,
            },
            createMessage,
        );

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(100000.05),
                bounce: true,
            },
            donateMessage,
        );

        const campaignBeforeWithdrawBalance = await donation.getCampaignBalance(1n);

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
                bounce: true,
            },
            withdrawMessage,
        );

        const campaignAfterWithdrawBalance = await donation.getCampaignBalance(1n);

        expect(campaignBeforeWithdrawBalance).toBeGreaterThan(campaignAfterWithdrawBalance);
    });

    it('should delete campaign', async () => {
        const createMessage: CreateCampaign = {
            $$type: 'CreateCampaign',
            id: 1n,
        };

        const deleteMessage: DeleteCampaign = {
            $$type: 'DeleteCampaign',
            id: 1n,
        };

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
                bounce: true,
            },
            createMessage,
        );

        await donation.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
                bounce: true,
            },
            deleteMessage,
        );

        const totalCampaign = await donation.getTotalCampaign();
        expect(totalCampaign).toBe(0n);
    });
});
