import "@stdlib/deploy";
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

contract Donation with Deployable, Ownable {
    // Empty init() function is present by default in all Tact contracts
    // since v1.3.0, so the following may be omitted:
    //
    owner: Address;
    campaigns: map<Int, Campaign>;
    numOfCampaign: Int as uint32;

    init(owner: Address) {
        self.owner = owner;
        self.campaigns = emptyMap();
        self.numOfCampaign = 0;
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
        require(!self.campaigns.exists(msg.id), "campaign is exists");

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            name: msg.name,
            balance: 0,
        });

        self.numOfCampaign += 1;
    }

    receive(msg: ReceiveDonation){
        require(self.campaigns.exists(msg.id), "campaign is not found");

        let campaign = self.campaigns.get(msg.id);

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            name: campaign!!.name,
            balance: campaign!!.balance + msg.amount,
        });
    }

    receive(msg: WithdrawCampaign){
        self.requireOwner();
        require(self.campaigns.exists(msg.id), "campaign not found");

        let campaign = self.campaigns.get(msg.id);
        let balance = myBalance();

        require(campaign!!.balance >= ton("1"), "minimum withdraw amount is 1 TON");
        require(campaign!!.balance >= msg.amount, "insufficient balance");
        require(balance > msg.amount, "insufficient balance");

        send(SendParameters{
            to: self.owner, 
            value: msg.amount, 
            mode: 0,
            bounce: true,
        });

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            name: campaign!!.name,
            balance: campaign!!.balance - msg.amount,
        });
    }

    receive(msg: DeleteCampaign) {
        self.requireOwner();
        require(self.campaigns.exists(msg.id), "campaign is not found");

        let campaign = self.campaigns.get(msg.id);

        if(campaign!!.balance > ton("1")){
            send(SendParameters{
                to: self.owner, 
                value: campaign!!.balance, 
                mode: 0,
                bounce: true,
                body: "successful withdraw campaign".asComment()
            });
        }
        
        self.campaigns.del(msg.id);
        self.numOfCampaign -= 1;
    }
}
