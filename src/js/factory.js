const enableEthereumButton = document.querySelector('#enable-ethereum-button');
const showAccountAddress = document.querySelector('#account-address');
const showAccountBalance = document.querySelector('#account-balance');

const createMusicakesButton = document.querySelector('#create-musicakes-button');

const getMusicakesCountButton = document.querySelector('#get-musicakes-count-button');
const musicakesCount = document.querySelector('#musicakes-count');

const getMusicakesAddressButton = document.querySelector('#get-musicakes-address-button');
const musicakesAddress = document.querySelector('#musicakes-address');

var web3 = new Web3(Web3.givenProvider);

enableEthereumButton.addEventListener('click', () => {
  getAccount();
});

createMusicakesButton.addEventListener('click', () => {
  createMusicakes();
});

getMusicakesCountButton.addEventListener('click', () => {
  getMusicakesCount();
});

getMusicakesAddressButton.addEventListener('click', () => {
  getMusicakesAddress();
});

var _abi = [
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "contracts",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
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
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getMusicakesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "musicakesCount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "getMusicakesAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "musicakesAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
]

const musicakesFactoryContractAddress = "0x43E60b4Ed7D763A4c4927Ad05d1C30610B1b06D8";
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

  const account = ethereum.selectedAddress;

  musicakesFactoryContract.methods.createNewMusicakes("Musicakes_1", "MSC_01").send({from: account})
  .once('transactionHash', function(hash) {
    console.log(hash);
  })
  .once('receipt', function(receipt) {
    console.log(receipt);

  })
  .on('error', function(error) {
    console.log(error);
  });
}


async function getMusicakesCount() {

  var musicakesCountResult = musicakesFactoryContract.methods.getMusicakesCount().call(function(error, result) {
    if (!error) {
      console.log(result);
      formatted_result = result.toString();
      musicakesCount.innerHTML = formatted_result;
    } else {
      console.log(error);
    }
  });
}

async function getMusicakesAddress() {

  var musicakesAddressResult = musicakesFactoryContract.methods.getMusicakesAddress(0).call(function(error, result) {
    if (!error) {
      console.log(result);
      musicakesAddress.innerHTML = result;
    } else {
      console.log(error);
    }
  });
}