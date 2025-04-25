import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress: Address = Address.parse('');
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contractAddress));

    await donation.send(
        provider.sender(),
        {
            value: toNano('1.05'),
        },
        {
            $$type: 'ReceiveDonation',
            id: 1n,
            amount: toNano(1),
        },
    );

    const campaignBalance = await donation.getCampaignBalance(1n);
    console.log(campaignBalance);
}
