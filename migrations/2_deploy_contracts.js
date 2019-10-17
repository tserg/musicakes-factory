var FDT_ERC20Extension = artifacts.require("FDT_ERC20Extension");

module.exports = function(deployer) {
  deployer.deploy(FDT_ERC20Extension, "MSC", "Musicakes", "0x5e34e72EA0138A8EDE71D5F8B7f8ED1549d62b58");

};
