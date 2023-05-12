// const verify = require("../helper-functions");
const { networkConfig, developmentChains, MIN_DELAY, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY, ADDRESS_ZERO } = require("../helper-hardhat-config");
const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async (hre) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await ethers.getContract("GovernanceToken", deployer);
  const timeLock = await ethers.getContract("TimeLock", deployer);
  const governor = await ethers.getContract("GovernorContract", deployer);

  log("----------------------------------------------------");
  log("Setting up contracts for roles...");
  // would be great to use multicall here...??
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
  await proposerTx.wait(1);
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO); //zero menas eveyr one can be execitur ye kya natak h..??
  await executorTx.wait(1);
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  //no one owenr of timelock we nned to go  through ny governer .governer only can propes timelock.
  await revokeTx.wait(1);
  // Guess what? Now, anything the timelock wants to do has to go through the governance process!
};

module.exports.tags = ["all", "setup"];
