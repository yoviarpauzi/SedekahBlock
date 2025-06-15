import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreateCampaign, Donation, ReceiveDonation, WithdrawCampaign } from '../wrappers/Donation';
import '@ton/test-utils';
import { setup } from './setupDonation';

describe('Donation: Withdraw Campaign', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let donation: SandboxContract<Donation>;

    beforeEach(async () => {
        const shared = await setup();
        donation = shared.donation;
        deployer = shared.deployer;
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

    it('should be fail withdraw campaign', async () => {});
});
