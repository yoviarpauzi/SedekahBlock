import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Dictionary, toNano } from '@ton/core';
import { CreateCampaign, Donation, DeleteCampaign } from '../build/Donation/Donation_Donation';
import '@ton/test-utils';

describe('Donation: Delete Campaign', () => {
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

    const deleteCampaign = async (id: bigint) => {
        const message: DeleteCampaign = {
            $$type: 'DeleteCampaign',
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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and donation are ready to use
    });

    it('should be success delete campaign', async () => {
        await createCampaign(1n);
        const totalCampaign = await donation.getTotalCampaign();
        await deleteCampaign(1n);
        const totalCampaignAfterDelete = await donation.getTotalCampaign();
        expect(totalCampaign).toBeGreaterThan(totalCampaignAfterDelete);
    });

    it("should be fail delete campaign if campaign id doesn't exist", async () => {
        const deleteCampaignWithIdNotExist: any = await deleteCampaign(1n);
        expect(deleteCampaignWithIdNotExist.transactions[1].description.computePhase.exitCode).toBe(134);
    });
});
