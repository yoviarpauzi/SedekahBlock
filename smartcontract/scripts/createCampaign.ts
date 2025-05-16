import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress: Address = Address.parse('0QBEsW5QAOSjha2T2a6PKpVet2H5ToDg1f06P_VkQZUMnUQ3');
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contractAddress));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'CreateCampaign',
            id: 1n,
            name: 'campaign 1',
        },
    );

    const campaignName = await donation.getCampaignName(1n);
}
