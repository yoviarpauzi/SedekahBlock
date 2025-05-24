import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress: Address = Address.parse('EQAFFJJAr7gaAPM7_EGjXb_GbQuRNN1EcxsQffvbhtWsp2EI');
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contractAddress));
    const isCampaignExist = await donation.getIsCampaignExist(1n);

    if (isCampaignExist) {
        console.log('campaign with id 1n exist');
    } else {
        console.log('campaign with id 1n is not exist');
    }
}
