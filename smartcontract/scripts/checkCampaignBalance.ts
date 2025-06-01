import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const contract: Address = Address.parse(contractAddress!);
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contract));
    const campaignBalance = await donation.getCampaignBalance(1n);
    console.log(`Campaign balance for id 1n is : ${Number(campaignBalance) / 1e9} TON`);
}
