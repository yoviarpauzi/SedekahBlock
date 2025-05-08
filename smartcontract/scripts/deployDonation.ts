import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ownerAddress: Address = Address.parse('0QBEsW5QAOSjha2T2a6PKpVet2H5ToDg1f06P_VkQZUMnUQ3');
    const donation: OpenedContract<Donation> = provider.open(await Donation.fromInit(ownerAddress));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(donation.address);

    // run methods on `donation`
}
