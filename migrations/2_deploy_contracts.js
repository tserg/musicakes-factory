var FDT_ERC20Extension = artifacts.require("FDT_ERC20Extension");

module.exports = function(deployer) {
  deployer.deploy(FDT_ERC20Extension, "MSC", "Musicakes", "0x841D4197A1dB5966B1b18A9563c11d81E9f001E6");

};
