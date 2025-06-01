import { Address, OpenedContract, toNano } from '@ton/core';
import { Donation } from '../wrappers/Donation';
import { NetworkProvider } from '@ton/blueprint';
import { contractAddress } from '../utils/environment';

export async function run(provider: NetworkProvider) {
    const contract: Address = Address.parse(contractAddress!);
    const donation: OpenedContract<Donation> = provider.open(Donation.fromAddress(contract));
    const isCampaignExist = await donation.getIsCampaignExist(35n);

    if (isCampaignExist) {
        console.log('campaign with id 35n exist');
    } else {
        console.log('campaign with id 35n is not exist');
    }
}
