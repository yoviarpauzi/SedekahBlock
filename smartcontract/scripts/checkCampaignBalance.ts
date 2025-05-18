import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress: Address = Address.parse('EQA9uLStATGNJmfPskYmaWE_N0iQCDMyxEMQ0cjQShSvN51L');
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contractAddress));
    const campaignBalance = await donation.getCampaignBalance(1n);
    console.log(`Campaign balance for id 1n is : ${Number(campaignBalance) / 1e9} TON`);
}
