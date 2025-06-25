import { Address, Dictionary, toNano } from '@ton/core';
import { Donation } from '../build/Donation/Donation_Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const address = Address.parse(contractAddress!);
    const donation = provider.open(Donation.fromAddress(address));

    const campaignBalance = await donation.getCampaignBalance(92n);
    console.log(campaignBalance);
}
