import "@stdlib/ownable";

struct Campaign {
    id: Int as uint32;
    balance: Int as uint256;
}

message CreateCampaign {
    id: Int as uint32;
}

message ReceiveDonation {
    id: Int as uint32;
    amount: Int as uint256;
}

message WithdrawCampaign{
    id: Int as uint32;
    amount: Int as uint256;
}

message TransferBalance{
    id: Int as uint32;
    toId: Int as uint32;
    amount: Int as uint256;
}

message DeleteCampaign {
    id: Int as uint32;
}

contract Donation(
    owner: Address, 
    campaigns: map<Int as uint32, Campaign>,
    numOfCampaign: Int as uint32 
) with Ownable{
    // Empty receiver for the deployment,
    // which expects the `null` message body
    receive() {
        // Forward the remaining value in the
        // incoming message back to the sender
        cashback(sender());
    }

    get fun isCampaignExist(id: Int): Bool{
        return self.campaigns.exists(id);
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
        throwUnless(134, !self.campaigns.exists(msg.id));

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            balance: 0,
        });

        self.numOfCampaign += 1;
    }

    receive(msg: ReceiveDonation){
        throwUnless(134, self.campaigns.exists(msg.id));
        throwUnless(134, msg.amount > 0);

        let campaign = self.campaigns.get(msg.id);

        self.campaigns.set(msg.id, Campaign{
            id: msg.id,
            balance: campaign!!.balance + msg.amount,
        });
    }

    receive(msg: WithdrawCampaign){
        self.requireOwner();
        throwUnless(134, self.campaigns.exists(msg.id));
        throwUnless(134, msg.amount > 0);

        let balance = myBalance();
        
        throwUnless(37, balance > msg.amount);
        
        let campaign = self.campaigns.get(msg.id);

        throwUnless(37, campaign!!.balance >= msg.amount);

        self.campaigns.set(msg.id, Campaign {
            id: msg.id,
            balance: campaign!!.balance - msg.amount
        });

        message(MessageParameters {
            to: sender(),    
            value: msg.amount, 
            mode: SendPayFwdFeesSeparately,
            bounce: true
        });
    }

    receive(msg: TransferBalance) {
        self.requireOwner();
        throwUnless(134, self.campaigns.exists(msg.id));
        throwUnless(134, self.campaigns.exists(msg.toId));

        let balance = myBalance();
        let campaign = self.campaigns.get(msg.id);
        let toCampaign = self.campaigns.get(msg.toId);

        throwUnless(37, balance > msg.amount);
        throwUnless(37, campaign!!.balance >= msg.amount);

        self.campaigns.set(msg.id, Campaign {
            id: msg.id,
            balance: campaign!!.balance - msg.amount
        });

        self.campaigns.set(msg.toId, Campaign {
            id: msg.toId,
            balance: toCampaign!!.balance + msg.amount
        });
    }

    receive(msg: DeleteCampaign) {
        self.requireOwner();
        throwUnless(134, self.campaigns.exists(msg.id));

        let _ = self.campaigns.del(msg.id);
        self.numOfCampaign -= 1;
    }
}
