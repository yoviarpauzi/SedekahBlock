import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';
import { ownerAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const owner: Address = Address.parse(ownerAddress!);
    const donation: OpenedContract<Donation> = provider.open(await Donation.fromInit(owner));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(donation.address);
}
