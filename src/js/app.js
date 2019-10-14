window.addEventListener('load', async () => {
// Modern dapp browsers...
  if (window.ethereum) {

    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      console.log("injected");
      App.initAccount();


    } catch (error) {
      console.log("Please enable access to Metamask");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    App.initAccount();

  }
  // Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
});

App = {
  Web3Provider: null,
  contracts: {},

  initAccount: function() {

    App.web3Provider = web3.currentProvider;
    // Display current wallet
    console.log("initAccount called");

    web3.eth.getAccounts().then(function(result){

      return result[0];
      
    }).then(function(account) {
      

      document.getElementById("account").innerHTML = account;

      // refresh page when wallet changes
      // see https://metamask.github.io/metamask-docs/Advanced_Concepts/Provider_API#ethereum.on(eventname%2C-callback)

      window.ethereum.on('accountsChanged', function(account) {
        window.location.reload(true);
      });


      // Display current wallet ETH balance
      var accountWeiBalance = web3.eth.getBalance(account, function(error, result) {
        if (!error) {
          console.log(JSON.stringify(result));

          var accountBalance = web3.utils.fromWei(result, "ether");
          document.getElementById("account_balance").innerHTML = accountBalance;

        } else {
          console.log(error);
        }
      });
    })
    return App.initContract();
  },

   initContract: function() {
    $.getJSON('FDT_ERC20Extension.json', function(data) {
      //Get the necessary contract artifact file and instantiate it with truffle-contract
      var FDT_ERC20ExtensionArtifact = data;
      App.contracts.FDT_ERC20Extension = TruffleContract(FDT_ERC20ExtensionArtifact);

      console.log(data);

      // Set the provider for this contracts
      App.contracts.FDT_ERC20Extension.setProvider(App.web3Provider);


      return App.getTokenSupply();
    });

    
  },



  handleMintTokens: function(event) {

    console.log("Mint Button pressed");

    var FDT_ERC20ExtensionInstance;

    web3.eth.getAccounts().then(function(accounts) {

      account = accounts[0];

      App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {
        FDT_ERC20ExtensionInstance = instance;

        return FDT_ERC20ExtensionInstance.mint($("#mint-token-address").val(), $("#mint-token-amount").val(), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  },

  handleAddMinter: function(event) {

    console.log("Button pressed");

    var FDT_ERC20ExtensionInstance;

    web3.eth.getAccounts().then(function(accounts) {

      account = accounts[0];

      App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {
        FDT_ERC20ExtensionInstance = instance;

        return FDT_ERC20ExtensionInstance.addMinter($("#new-minter-address").val(), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  handleClaimDividends: function(event) {
    console.log("Claim Dividends button pressed");

    var FDT_ERC20ExtensionInstance;

    web3.eth.getAccounts().then(function(accounts) {

      account = accounts[0];

      App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {

        FDT_ERC20ExtensionInstance = instance;

        return FDT_ERC20ExtensionInstance.withdrawFunds({from: account});
      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },

  handlePayContract: function(event) {
    console.log("Pay Button pressed");

    var FDT_ERC20ExtensionInstance;

        // https://ethereum.stackexchange.com/questions/24220/how-to-generate-truffle-artifact-for-already-deployed-contract-for-use-with-web3
    // https://ethereum.stackexchange.com/questions/38828/truffle-what-is-the-best-way-to-to-get-the-json-abi-code-after-deploying-a-cont

        var _abi = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    // create a new contract instance with methods defined in abi and the address of the smart contract to call

    var PaymentToken = new web3.eth.Contract(_abi, "0x487c79b46f68ea1E51790A6E32cdd4589cA06511");

    web3.eth.getAccounts().then(function(accounts) {

      account = accounts[0];

      App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {

        FDT_ERC20ExtensionInstance = instance;
        var _contractAddress = FDT_ERC20ExtensionInstance.address;

        console.log(_contractAddress);
        console.log(account);

        var _payAmount = ($("#pay-contract-amount").val());

        console.log(_payAmount);

        var payAmount = _payAmount * Math.pow(10, 18);

        console.log("Number of payment tokens to pay: " + payAmount);

        PaymentToken.methods.approve(account, payAmount);

        PaymentToken.methods.transferFrom(account, PaymentToken.options.address, payAmount);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getTokenSupply: function() {

    var FDT_ERC20ExtensionInstance;

    App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {
      FDT_ERC20ExtensionInstance = instance;

      return FDT_ERC20ExtensionInstance.totalSupply();
    }).then(function(tokenSupply) {
      console.log("Token supply: " + tokenSupply);
      document.getElementById("token-supply").innerHTML = tokenSupply;
    }).catch(function(err){
      console.log(err.message);
    });

    return App.getUserPaymentTokenCount();
  },

  getUserPaymentTokenCount: function() {

    // https://ethereum.stackexchange.com/questions/24220/how-to-generate-truffle-artifact-for-already-deployed-contract-for-use-with-web3
    // https://ethereum.stackexchange.com/questions/38828/truffle-what-is-the-best-way-to-to-get-the-json-abi-code-after-deploying-a-cont

        var _abi = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      }
    ];

    // create a new contract instance with methods defined in abi and the address of the smart contract to call

    var PaymentToken = new web3.eth.Contract(_abi, "0x487c79b46f68ea1E51790A6E32cdd4589cA06511");

    web3.eth.getAccounts().then(function(accounts){

      account = accounts[0];

      // to call function of another smart contract on the network, use method.[function]      

      return PaymentToken.methods.balanceOf(account).call();
    }).then(function(_userPaymentTokenCount) {
      userPaymentTokenCount = _userPaymentTokenCount / Math.pow(10, 18);
      console.log("Payment tokens held in this wallet: " + userPaymentTokenCount);
      document.getElementById("payment-token-balance").innerHTML = userPaymentTokenCount;
    }).catch(function(err){
      console.log(err.message);
    });

    return App.getUserTokenCount();

  },

  getUserTokenCount: function() {
    var FDT_ERC20ExtensionInstance;

    web3.eth.getAccounts().then(function(accounts) {
      account = accounts[0];
      App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {
        FDT_ERC20ExtensionInstance = instance;

        return FDT_ERC20ExtensionInstance.balanceOf(account);
      }).then(function(userTokenCount) {
        console.log("Tokens held in this wallet: " + userTokenCount);
        document.getElementById("user-token-count").innerHTML = userTokenCount;
      }).catch(function(err){
        console.log(err.message);
      });

    });

    return App.getDividendBalance();

  },

  getDividendBalance: function() {
    var FDT_ERC20ExtensionInstance;

    web3.eth.getAccounts().then(function(accounts) {
      account = accounts[0];
      App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {
        FDT_ERC20ExtensionInstance = instance;

        return FDT_ERC20ExtensionInstance.withdrawableFundsOf(account);
      }).then(function(userDividendBalance) {
        console.log(JSON.stringify(userDividendBalance));
        var _userDividendBalance = web3.utils.fromWei(userDividendBalance, "ether");
        console.log("Dividends unclaimed in ETH: " + _userDividendBalance);
        document.getElementById("dividend-balance").innerHTML = _userDividendBalance;
      }).catch(function(err){
        console.log(err.message);
      });

    });

    return App.getMinterDashboard();
  },

  getMinterDashboard: function() {

    var mintButton = document.getElementById("btn-mint-tokens");
    mintButton.addEventListener("click", function() {
      return App.handleMintTokens();
    });

    var addMinterButton = document.getElementById("btn-add-minter");
    addMinterButton.addEventListener("click", function () {
      return App.handleAddMinter();
    });


    var claimDividendsButton = document.getElementById("btn-claim-dividends");
    claimDividendsButton.addEventListener("click", function () {
      return App.handleClaimDividends();
    });

    var payToContractButton = document.getElementById("btn-pay-contract");
    payToContractButton.addEventListener("click", function () {
      return App.handlePayContract();
    });

    return App.getContractBalance();
  },

  getContractBalance: function() {
    var FDT_ERC20ExtensionInstance;

    App.contracts.FDT_ERC20Extension.deployed().then(function(instance) {
      FDT_ERC20ExtensionInstance = instance;

      return FDT_ERC20ExtensionInstance.address;
    }).then(function(contractAddress) {
      console.log("Contract Address: " + contractAddress);

      document.getElementById("contract-address").innerHTML = contractAddress;

      var contractWeiBalance = web3.eth.getBalance(contractAddress, function(error, result) {
        if (!error) {
          console.log(JSON.stringify(result));

          var contractBalance = web3.utils.fromWei(result, "ether");
          document.getElementById("contract-funds-balance").innerHTML = contractBalance;

        } else {
          console.log(error);
        }
      });

    });

  }

};