import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress: Address = Address.parse('EQA9uLStATGNJmfPskYmaWE_N0iQCDMyxEMQ0cjQShSvN51L');
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contractAddress));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'DeleteCampaign',
            id: 1n,
        },
    );
}
