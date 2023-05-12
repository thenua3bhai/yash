// const verify = require("../helper-functions");
const { networkConfig, developmentChains, MIN_DELAY, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY } = require("../helper-hardhat-config");
const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async (hre) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying Box and waiting for confirmations...");
  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`Box at ${box.address}`);
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(box.address, []);
  }
  const boxContract = await ethers.getContractAt("Box", box.address);
  const timeLock = await ethers.getContract("TimeLock");
  const transferTx = await boxContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);
};

module.exports.tags = ["all", "box"];
