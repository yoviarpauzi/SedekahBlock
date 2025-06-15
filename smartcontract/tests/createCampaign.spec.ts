import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreateCampaign, Donation } from '../wrappers/Donation';
import '@ton/test-utils';
import { setup } from './setupDonation';

describe('Donation: Create Campaign', () => {
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
