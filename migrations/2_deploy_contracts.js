var FDT_ERC20Extension = artifacts.require("FDT_ERC20Extension");

module.exports = function(deployer) {
  deployer.deploy(FDT_ERC20Extension, "MSC", "Musicakes", "0x650423bC045375386C276097f1ccaBe9e36DF2A3");

};
