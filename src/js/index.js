

//global variables or objects.
let web3;
let DhiSale;
let Dhi;
let DhiAddress;
let account;
let contentBox = document.getElementById('card');
let loader = document.getElementById('loader');
let events;



//it deploy the Dhi Contract and return deployed instance.
const initDhi = async () => {
    //get the the account from meta mask / web3.
    account = await getUserAccounts();

    //get the compiled file of Dhi Contract genrated by truffle.
    let dhiJsonInterface = await $.getJSON("Dhi.json");

    let instance = new web3.eth.Contract(dhiJsonInterface.abi);  // defines or create new object of Contract.

    //and meta data or options to created object.
    instance.options.address = "";
    instance.options.from = account;
    instance.options.gas = 1000000;
    instance.options.gasPrice = '1000000000';

    //adds bytecode to the option
    instance.options.data = dhiJsonInterface.bytecode;

    //deploy the contract to local blockchain and return instance.
    return instance.deploy({ arguments: [10000000] }).send({ from: account }).then((contractInstance) => {
        // console.log(contractInstance.options.address);
        //DhiAddress = contractInstance.options.address;
        return contractInstance;
    })
}

//DhiSale its basically crowd sale contract that gives the functinality to users buy or sell tokens
const initDhiSale = async () => {
    account = getAccounts();

    //get compiled data 
    let DhiSaleJsonInterface = await $.getJSON("DhiSale.json");

    //create new object of DhiSale Contract.
    let instance = new web3.eth.Contract(DhiSaleJsonInterface.abi);

    //added meta data or required options
    instance.options.address = "";
    instance.options.from = account;
    instance.options.gas = 1000000;
    instance.options.gasPrice = '1000000000';

    //add bytecode required for deployement.
    instance.options.data = DhiSaleJsonInterface.bytecode;

    //deploy the DhiSale contract

    console.log(web3.utils.checkAddressChecksum(Dhi.options.address));
    //Dhi is an already deployed contract object.

    //it gives the error
    return instance.deploy({ arguments: [Dhi.options.address, 1000000000] }).send({ from: account }).then((contractInstance) => {
        console.log("Dhi Sale address :" + contractInstance.options.address);
        return contractInstance;
    })

}


//initilize or dectect web3 provider on browser .
const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return web3;
    } else if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        return web3;
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        return web3;
    }
}


//getter
// get web3 user accounts address
const getUserAccounts = async () => {
    let accounts = await web3.eth.getAccounts();
    return accounts[0];
}

const getUserBalance = async () => {
    return Dhi.methods.balanceOff(account).call({ from: account }).then((result) => {
        return result;
    })
}



//setter

const setAmountRange = async () => {
    document.getElementById('transferAmount').max = await getUserBalance().then((balance) => {
        return balance.substring(0, balance.length - 2);
    }) + ".00";
}

const setTransferFrom = async () => {
    Dhi.getPastEvents('Approval', {
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, events) => {
    }).then((events) => {
        var n = events.length;

        console.log(events);

        var addressSelector = document.getElementById('fromAddress');
        var transferFromButton = document.getElementById('transferFromButton');

        transferFromButton.hidden = true;


        removeAllChild(addressSelector);

        var firstOption = createOptionElement("Select Address From You Want To Send DHI");
        firstOption.selected = "true";
        firstOption.hidden = "true";
        addressSelector.appendChild(firstOption);

        for (var i = n - 1; i >= 0; i--) {
            var spender = events[i].returnValues._spender;
            var owner = events[i].returnValues._owner;
            var amount = events[i].returnValues._value;
            if (spender.toUpperCase() == account.toUpperCase()) {
                var option = createOptionElement(owner, amount);
                addressSelector.appendChild(option);
                transferFromButton.hidden = false;
            }

        }
    })
}

const setTransferFromAmount = async (event) => {
    var amount = event.target.options[event.target.selectedIndex].dataset.amount;
    var resultAmount = amount.substring(0, amount.length - 2);
    var element = document.getElementById('transferFromAmount');
    element.max = resultAmount;
    element.value = 1;
}


const createOptionElement = (value, amount) => {
    var option = document.createElement('option');
    option.value = value;
    option.innerHTML = value;
    option.id = value;
    option.setAttribute("data-amount", amount);
    return option;
}



//checker

const transferPopup = async () => {
    var toAddress = document.getElementById('toAddress').value;
    var amount = document.getElementById('transferAmount').value;

    var balance = document.getElementById('mainBalanceView').innerHTML;

    var remaningAmount = (parseInt(balance) - parseInt(amount));

    document.getElementById('transferAddressView').innerHTML = toAddress;
    document.getElementById('transferAmountView').innerHTML = amount;
    document.getElementById('remaningAccountBal').innerHTML = remaningAmount;
}

const approvalPopup = async () => {

    var recipientAddress = document.getElementById('recipientAddress').value;
    var amount = document.getElementById('approvedAmount').value;


    document.getElementById('recipientAddressView').innerHTML = recipientAddress;
    document.getElementById('approvedAmountView').innerHTML = amount;

}

const transferFromPopup = async () => {
    var fromAddress = document.getElementById('fromAddress').value;
    var toAddress = document.getElementById('reciverAddress').value;
    var amount = document.getElementById('transferFromAmount').value;

    document.getElementById('transferFromAddressView').innerHTML = fromAddress;
    document.getElementById('transferFromReciverAddressView').innerHTML = toAddress;
    document.getElementById('transferFromAmountView').innerHTML = amount;

}


const transferFrom = async () => {
    var fromAddress = document.getElementById('fromAddress').value;
    var toAddress = document.getElementById('reciverAddress').value;
    var amount = document.getElementById('transferFromAmount').value;

    var resultAmount = amount * 100;

    loader.style.display = "block";
    contentBox.style.display = "none";

    Dhi.methods.transferFrom(fromAddress, toAddress, resultAmount).send({ from: account }).on('error', () => {
        console.log("error occured");
        alert('Something Went Wrong Try Again');
        reloadContent();
        loader.style.display = "none";
        contentBox.style.display = "block";
    }).on('receipt', (receipt) => {
        if (receipt.status == true) {
            alert("success");
        } else {
            console.log('Failed');
            alert("failed");
        }
        loader.style.display = "none";
        contentBox.style.display = "block";
        reloadContent();

    })

}



const transfer = async () => {
    var toAddress = document.getElementById('toAddress').value;
    var amount = document.getElementById('transferAmount').value;

    var resultAmount = amount * 100;

    contentBox.style.display = "none";
    loader.style.display = "block";

    Dhi.methods.transfer(toAddress, resultAmount).send({ from: account }).on('error', () => {
        console.log("failed");
        alert("Something Went Wrong");
        reloadContent();
        loader.style.display = "none";
        contentBox.style.display = "block";
    }).on('receipt', (receipt) => {
        if (receipt.status == true) {
            alert("sccuess");
        } else {
            console.log("failed");
            alert("failed");
        }
        reloadContent();
        loader.style.display = "none";
        contentBox.style.display = "block";

    })


}

const approval = () => {
    var recipientAddress = document.getElementById('recipientAddress').value;
    var amount = document.getElementById('approvedAmount').value;

    var resultAmount = amount * 100;

    contentBox.style.display = "none";
    loader.style.display = "block";

    Dhi.methods.approve(recipientAddress, resultAmount).send({ from: account }).on('error', () => {
        console.log("failed");
        alert("Something Went Wrong");
        reloadContent();
        loader.style.display = "none";
        contentBox.style.display = "block";
    }).on('receipt', (receipt) => {
        if (receipt.status == true) {
            alert('success');
        } else {
            console.log('failed');
            alert('failed');
        }
        contentBox.style.display = "block";
        loader.style.display = "none";
        reloadContent();
    })
}


const displayAllTranasction = async () => {
    Dhi.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, _events) => { }).then((_events) => {
        var n = _events.length;
        let transactionList = document.getElementById("transactionList");
        removeAllChild(transactionList);

        //stop the loader
        //document.getElementById('loader2').style.display = "none";

        for (i = n - 1; i >= 0; i--) {


            var name = _events[i].event;
            var from = _events[i].returnValues._from;
            var to = _events[i].returnValues._to;
            var amount = _events[i].returnValues._value;
            var mystring = "";
            if (from.toUpperCase() == account.toUpperCase()) {
                var element = createTransactionElement("Transfered", "To : " + to, amount.substring(0, amount.length - 2), "list-group-item-danger");
                transactionList.appendChild(element);
            } else if (to.toUpperCase() == account.toUpperCase()) {
                var element = createTransactionElement("Recived", "From : " + from, amount.substring(0, amount.length - 2), "list-group-item-success");
                transactionList.appendChild(element);
            }
        }
    });
}


const removeAllChild = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const createTransactionElement = (eventName, toAddress, amount, background) => {
    var element = document.createElement("a");
    element.href = "#";
    element.className = "list-group-item list-group-item-action " + background;


    var div = document.createElement("div");
    div.className = "d-flex w-100 justify-content-between";


    var h5 = document.createElement("h5");
    h5.className = "mb-1";
    h5.innerHTML = eventName;

    var small1 = document.createElement("small");
    small1.className = "text-muted";
    small1.innerHTML = "now";

    var p = document.createElement("p");
    p.className = "mb-1";
    p.innerHTML = "Amount : " + amount

    var small2 = document.createElement("small");
    small2.className = "text-muted";
    small2.innerHTML = toAddress;

    div.appendChild(h5);
    div.appendChild(small1);

    element.appendChild(div);
    element.appendChild(p);
    element.appendChild(small2);

    return element;
}


window.ethereum.on('accountsChanged', (accounts) => {
    account = accounts[0];
    reloadContent();
})




const displayBalance = async () => {
    getUserBalance().then((result) => {
        var mainAmount = result.substring(0, result.length - 2);
        var decimalAmount = result.slice(result.length - 2);
        document.getElementById('mainBalanceView').innerHTML = mainAmount + "." + decimalAmount;
    });

}

const displayAddress = async () => {
    document.getElementById("userAddressView").innerHTML = String(account);
}






const init = async () => {

    web3 = await initWeb3();
    account = getUserAccounts();

    Dhi = await initDhi();

    //console.log(Dhi.options.address);
    //DhiSale = await initDhiSale(Dhi.options);
    await reloadContent();
}

const reloadContent = async () => {


    await displayAddress();
    await displayBalance();
    await setAmountRange();
    await setTransferFrom();
    await displayAllTranasction();


    loader.style.display = "none";
    contentBox.style.display = "block";
}


init();



//Dom functions

const showRangeAmount = () => {
    var rangeAmount = document.getElementById('transferAmount').value;
    document.getElementById('rangeAmountView').innerHTML = rangeAmount;

}

const tfshowRangeAmount = () => {
    var rangeAmount = document.getElementById('transferFromAmount').value;
    document.getElementById('tfrangeAmountView').innerHTML = rangeAmount;

}  