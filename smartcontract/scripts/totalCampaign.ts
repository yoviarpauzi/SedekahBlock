import { Address, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const contract = Address.parse(contractAddress);
    const donation = provider.open(Donation.fromAddress(contract));

    const totalCampaign = await donation.getTotalCampaign();
    console.log(totalCampaign);
}
