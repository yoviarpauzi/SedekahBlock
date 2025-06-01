import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const contract: Address = Address.parse(contractAddress!);
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contract));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'WithdrawCampaign',
            id: 1n,
            amount: toNano('2'),
        },
    );
}
