import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress: Address = Address.parse('EQAFFJJAr7gaAPM7_EGjXb_GbQuRNN1EcxsQffvbhtWsp2EI');
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
}
