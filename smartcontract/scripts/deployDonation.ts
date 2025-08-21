import { Address, Dictionary, toNano } from '@ton/core';
import { Donation } from '../build/Donation/Donation_Donation';
import { NetworkProvider } from '@ton/blueprint';
import { ownerAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const address = Address.parse(ownerAddress!);
    const donation = provider.open(await Donation.fromInit(address, Dictionary.empty(), 0n));

    await donation.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(donation.address);
}

