import "@stdlib/ownable";

struct Campaign {
    id: Int as uint32;
    name: String;
    balance: Int as uint256;
}

message CreateCampaign {
    id: Int as uint32;
    name: String;
}

message ReceiveDonation {
    id: Int as uint32;
    amount: Int as uint256;
}

message WithdrawCampaign{
    id: Int as uint32;
    amount: Int as uint256;
}

message DeleteCampaign {
    id: Int as uint32;
}

contract Donation with Ownable {
    owner: Address;
    campaigns: map<Int as uint23, Campaign>;
    numOfCampaign: Int as uint32;

    init(owner: Address) {
        self.owner = owner;
        self.campaigns = emptyMap();
        self.numOfCampaign = 0;
    }

    receive() {
        cashback(sender())
    }

    get fun campaignName(id: Int): String{
        let campaign = self.campaigns.get(id);

        return campaign!!.name;
    }

    get fun campaignBalance(id: Int): Int{
        let campaign = self.campaigns.get(id);

        return campaign!!.balance;
    }

    get fun totalCampaign(): Int{
        return self.numOfCampaign;
    }

    receive(msg: CreateCampaign) {
        self.requireOwner();
        throwUnless(1024,!self.campaigns.exists(msg.id));

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            name: msg.name,
            balance: 0,
        });

        self.numOfCampaign += 1;
    }

    receive(msg: ReceiveDonation){
        throwUnless(1024, self.campaigns.exists(msg.id));
        throwUnless(1024, msg.amount > 0);

        let campaign = self.campaigns.get(msg.id);

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            name: campaign!!.name,
            balance: campaign!!.balance + msg.amount,
        });
    }

    receive(msg: WithdrawCampaign){
        self.requireOwner();
        throwUnless(1024, self.campaigns.exists(msg.id));
        throwUnless(1024, msg.amount > 0);

        let campaign = self.campaigns.get(msg.id);
        let balance = myBalance();

        throwUnless(1024,campaign!!.balance >= ton("1"));
        throwUnless(1024, campaign!!.balance >= msg.amount);
        throwUnless(1024, balance > msg.amount);

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            name: campaign!!.name,
            balance: campaign!!.balance - msg.amount,
        });

        message(MessageParameters {
            to: sender(),    
            value: msg.amount, 
        });
    }

    receive(msg: DeleteCampaign) {
        self.requireOwner();
        throwUnless(1024, self.campaigns.exists(msg.id));
        
        let _ = self.campaigns.del(msg.id);
        self.numOfCampaign -= 1;
    }
}
