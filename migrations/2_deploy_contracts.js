var FDT_ERC20Extension = artifacts.require("FDT_ERC20Extension");

module.exports = function(deployer) {
  deployer.deploy(FDT_ERC20Extension, "MSC", "Musicakes", "<<ADDRESS>>");

};
