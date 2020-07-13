pragma solidity ^0.5.0;

import "./external/math/SafeMathUint.sol";
import "./external/math/SafeMathInt.sol";

import "./IFundsDistributionToken.sol";
import "./FundsDistributionToken.sol";


contract FDT_ERC20Extension is IFundsDistributionToken, FundsDistributionToken {

	using SafeMathUint for uint256;
	using SafeMathInt for int256;

	// token to be used for sending to this contract
	IERC20 public fundsToken;

	// balance of fundsToken that this contract currently holds
	uint256 public fundsTokenBalance;

	modifier onlyFundsToken () {
		require(msg.sender == address(fundsToken), "FDT_ERC20Extension.onlyFundsToken: UNAUTHORISED_SENDER");
		_;
	}

	constructor(
		address owner,
		string memory name, 
		string memory symbol
	)
		public
		FundsDistributionToken(owner, name, symbol) 
	{

		fundsToken = IERC20(0x8172359A336C7318cc2a74cD4a6cDAeBcbc8D7e9);
	}

	/**
	 * @notice Withdraws available funds for user.
	 */
	function withdrawFunds() 
		external 
	{
		int256 newFunds = _updateFundsTokenBalance();

		if (newFunds > 0) {
			_distributeFunds(newFunds.toUint256Safe());
		}
		
		uint256 withdrawableFunds = _prepareWithdraw();
		
		require(fundsToken.transfer(msg.sender, withdrawableFunds), "FDT_ERC20Extension.withdrawFunds: TRANSFER_FAILED");

		_updateFundsTokenBalance();
	}

	/**
	 * @dev Updates the current funds token balance 
	 * and returns the difference of new and previous funds token balances
	 * @return A int256 representing the difference of the new and previous funds token balance
	 */
	function _updateFundsTokenBalance() internal returns (int256) {
		uint256 prevFundsTokenBalance = fundsTokenBalance;
		
		fundsTokenBalance = fundsToken.balanceOf(address(this));

		if (prevFundsTokenBalance > fundsTokenBalance) {
			return int256(prevFundsTokenBalance).sub(int256(fundsTokenBalance));
		} 

		else if (fundsTokenBalance > prevFundsTokenBalance) {
			return int256(fundsTokenBalance).sub(int256(prevFundsTokenBalance));
		} 

		else {
			return 0;
		}

		
	}

	/**
	 * @notice Register a payment of funds in tokens. May be called directly after a deposit is made.
	 * @dev Calls _updateFundsTokenBalance(), whereby the contract computes the delta of the previous and the new 
	 * funds token balance and increments the total received funds (cumulative) by delta by calling _registerFunds()
	 */
	function updateFundsReceived() external {
		int256 newFunds = _updateFundsTokenBalance();

		if (newFunds > 0) {
			_distributeFunds(newFunds.toUint256Safe());
		}
	}

	/**
	 * @notice Pay fundsToken to contract
	 * Front end should call fundsToken contract to approve transfer - https://ethereum.stackexchange.com/questions/57286/make-function-payable-for-a-specific-erc20-token
	 * https://ethereum.stackexchange.com/questions/30527/smart-contract-to-receive-tokens-and-give-ether/30532
	 */

	function payToContract()
		external
	{

		require(fundsToken.allowance(msg.sender, address(this)) > 0);
		uint256 amount = fundsToken.allowance(msg.sender, address(this));
		require(fundsToken.transferFrom(msg.sender, address(this), amount));

	}


}

contract MusicakesFactory {
	FDT_ERC20Extension[] deployedMusicakesContracts;
	address[] public contracts;

	function createNewMusicakes(string calldata name, string calldata symbol) external {
		FDT_ERC20Extension instance = new FDT_ERC20Extension(msg.sender, name, symbol);
		deployedMusicakesContracts.push(instance);
		contracts.push(address(instance));
	}

	function getMusicakesCount()
		public
		view
		returns(uint musicakesCount)
	{
		return contracts.length;
	}

	function getMusicakesAddress(uint count)
		public
		view
		returns(address musicakesAddress)
	{
		return contracts[count];
	}

}