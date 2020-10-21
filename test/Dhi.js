let Dhi = artifacts.require("./Dhi.sol");

contract('Dhi', function (accounts) {

    it('check initial values', () => {
        return Dhi.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.name();
        }).then((tokenName) => {
            assert.equal(tokenName, 'DHI TOKEN', 'token name incorrect');
            return contractInstance.symbol();
        }).then((symbol) => {
            assert.equal(symbol, 'DHI', 'symbol is wrong');
            return contractInstance.decimals();
        }).then((decimals) => {
            assert.equal(decimals.toNumber(), 2, 'decimal value is wrong');
        })
    })

    it('check total sypply and balance of accounts', () => {
        return Dhi.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.totalSupply();
        }).then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), 100000, 'the total supply amount is incorrect');
            return contractInstance.balanceOff(accounts[0]);
        }).then((accountBal) => {
            assert.equal(accountBal.toNumber(), 100000, 'the account balance is wrong');
        })
    })

    it('check transfer methods working', () => {
        return Dhi.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.transfer(accounts[1], 2000, { from: accounts[0] });
        }).then((result) => {
            assert.equal(result.logs.length, 1, 'event not triggered');
            assert.equal(result.logs[0].event, 'Transfer', 'Transfer event not triggered');
            assert.equal(result.logs[0].args._from, accounts[0], 'the spender account doesnt match');
            assert.equal(result.logs[0].args._to, accounts[1], 'The reciver account doesnt match');
            assert.equal(result.logs[0].args._value, 2000, 'The amount will be mismatched');
            return contractInstance.balanceOff(accounts[0]);
        }).then((account1Bal) => {
            assert.equal(account1Bal, 98000, 'The account 1 balance mismatched');
            return contractInstance.balanceOff(accounts[1]);
        }).then((account2Bal) => {
            assert.equal(account2Bal, 2000, 'The account 2 balance is mismatched');
        })
    })

    it('check approve  & transfer of methods ', () => {
        return Dhi.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.approve(accounts[1], 1000, { from: accounts[0] });
        }).then((result) => {
            assert.equal(result.logs.length, 1, 'approve event not triggered');
            assert.equal(result.logs[0].event, 'Approval', 'Approval event not triggered');
            assert.equal(result.logs[0].args._owner, accounts[0], 'The owner are mismatched');
            assert.equal(result.logs[0].args._spender, accounts[1], 'The spender are mismatched');
            assert.equal(result.logs[0].args._value.toNumber(), 1000, 'The amount are wrong');
            return contractInstance.transferFrom(accounts[0], accounts[2], 900, { from: accounts[1] });
        }).then((result) => {
            assert.equal(result.logs.length, 1, ' Transfer event is not triggered');
            assert.equal(result.logs[0].event, 'Transfer', 'Transfer event is not triggered');
            assert.equal(result.logs[0].args._from, accounts[0], 'The from accounts are mismatched');
            assert.equal(result.logs[0].args._to, accounts[2], 'The reciver accounts are mismatched');
            assert.equal(result.logs[0].args._value.toNumber(), 900, 'The amount is mismatched');
            return contractInstance.balanceOff(accounts[0]);
        }).then((account1Bal) => {
            assert.equal(account1Bal.toNumber(), 97100, 'The account 1 Balance is wrong');
            return contractInstance.balanceOff(accounts[2]);
        }).then((account3Bal) => {
            assert.equal(account3Bal.toNumber(), 900, 'The account 3 Balance is wrong');
        })
    })




    //   7798850199 chentan gadekar


})