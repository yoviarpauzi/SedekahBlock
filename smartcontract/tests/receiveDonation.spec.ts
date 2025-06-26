import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Dictionary, toNano } from '@ton/core';
import { CreateCampaign, Donation, ReceiveDonation } from '../build/Donation/Donation_Donation';
import '@ton/test-utils';

describe('Donation: Receive Donation', () => {
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

        return await donation!.send(
            deployer!.getSender(),
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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and donation are ready to use
    });

    it('should receive donation', async () => {
        await Promise.all([createCampaign(1n), donateCampaign(1n, 1n)]);
        const campaignBalance = await donation.getCampaignBalance(1n);
        expect(campaignBalance).toBe(1n);
    });

    it("should error receive donation if campaign doesn't exist", async () => {
        await createCampaign(1n);

        const donateCampaignNotExistId: any = await donateCampaign(2n, 1n);

        expect(donateCampaignNotExistId.transactions[1].description.computePhase.exitCode).toBe(134);
    });

    it('should error receive donation if donation amount is zero', async () => {
        await createCampaign(1n);

        const donateCampaignZeroAmount: any = await donateCampaign(1n, 0n);

        expect(donateCampaignZeroAmount.transactions[1].description.computePhase.exitCode).toBe(134);
    });
});
