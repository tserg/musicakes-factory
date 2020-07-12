const enableEthereumButton = document.querySelector('#enable-ethereum-button');
const showAccountAddress = document.querySelector('#account-address');
const showAccountBalance = document.querySelector('#account-balance');

const createMusicakesButton = document.querySelector('#create-musicakes-button');

var web3 = new Web3(Web3.givenProvider);

enableEthereumButton.addEventListener('click', () => {
  getAccount();
});

createMusicakesButton.addEventListener('click', () => {
  createMusicakes();
});

var _abi = [
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        }
      ],
      "name": "createNewMusicakes",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

const musicakesFactoryContractAddress = "0xe3191B3f8e3d58A644d3d0Aa094d5A501CACB44F";
const musicakesFactoryContract = new web3.eth.Contract(_abi, musicakesFactoryContractAddress);

ethereum.on('accountsChanged', function(accounts) {
  loadInterface();
});

async function getAccount() {
  await ethereum.enable();
  loadInterface();
}

async function loadInterface() {

  const account = ethereum.selectedAddress;
  showAccountAddress.innerHTML = account;

  // Get ETH balance of current address

  var accountWeiBalance = web3.eth.getBalance(account, function(error, result) {
    if (!error) {
      var accountBalance = (parseFloat(result)/parseFloat(10**18)).toFixed(18);
      showAccountBalance.innerHTML = accountBalance;
      } else {
      console.log(error);
    }
  });
}

async function createMusicakes() {

  var musicakes = musicakesFactoryContract.methods.createNewMusicakes("Musicakes_1", "MSC_01").call(function(error, result) {
    if (!error) {
      console.log('success');
    } else {
      console.log(error);
    }
  });
}



