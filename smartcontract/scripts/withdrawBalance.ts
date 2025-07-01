import { Address, Dictionary, toNano } from '@ton/core';
import { Donation } from '../build/Donation/Donation_Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const address = Address.parse(contractAddress!);
    const donation = provider.open(Donation.fromAddress(address));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'WithdrawCampaign',
            id: 92n,
            amount: toNano('2.6'),
        },
    );
}
