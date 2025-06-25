import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Dictionary, toNano } from '@ton/core';
import { CreateCampaign, Donation } from '../build/Donation/Donation_Donation';
import '@ton/test-utils';

describe('Donation: CreateCampaign', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let donation: SandboxContract<Donation>;

    beforeEach(async () => {
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

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and donation are ready to use
    });

    it('should success create campaign', async () => {
        await Promise.all([createCampaign(1n), createCampaign(2n)]);

        expect(await donation!.getTotalCampaign()).toBe(2n);
        expect(await donation!.getIsCampaignExist(1n)).toBe(true);
        expect(await donation!.getIsCampaignExist(2n)).toBe(true);
    });

    it('should fail create campaign with duplicate id', async () => {
        await createCampaign(1n);

        const result: any = await createCampaign(1n);

        expect(result.transactions[1].description.computePhase.exitCode).toBe(134);
    });
});
