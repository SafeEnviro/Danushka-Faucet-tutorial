var SafeMath = artifacts.require("SafeMath");
var Coindb = artifacts.require("Coindb");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Coindb);
  
};
