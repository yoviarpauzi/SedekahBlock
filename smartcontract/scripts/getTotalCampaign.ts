import { Address, Dictionary, toNano } from '@ton/core';
import { Donation } from '../build/Donation/Donation_Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const address = Address.parse(contractAddress!);
    const donation = provider.open(Donation.fromAddress(address));

    const totalCampaign = await donation.getTotalCampaign();
    console.log(totalCampaign);
}
