// const verify = require("../helper-functions");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async (hre) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, player } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying GovernanceToken and waiting for confirmations...");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`GovernanceToken at ${governanceToken.address}`);
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governanceToken.address, []);
  // }
  log(`Delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer, player);
  log("Delegated!");
};

const delegate = async (governanceTokenAddress, delegatedAccount, player) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  console.log(`Deployer balance ${await governanceToken.balanceOf(delegatedAccount)}`);

  const accounts = await ethers.getSigners();
  const governanceTokenPlayer = await governanceToken.connect(accounts[1]);
  const governanceTokenPlayer2 = await governanceToken.connect(accounts[2]);
  const transactionResponse = await governanceToken.delegate(delegatedAccount);
  await transactionResponse.wait(1);
  const tx = await governanceToken.transfer(player, "11111111111");
  await tx.wait(1);
  const tx2 = await governanceToken.transfer(accounts[2].address, "11111111111");
  await tx2.wait(1);

  const transactionResponse2 = await governanceTokenPlayer.delegate(player);
  await transactionResponse2.wait(1);
  const transactionResponse3 = await governanceTokenPlayer2.delegate(accounts[2].address);
  await transactionResponse3.wait(1);
  console.log(`deployer balance ${await governanceToken.balanceOf(delegatedAccount)}`);
  console.log(`Checkpoints: deployer ${await governanceToken.numCheckpoints(delegatedAccount)}`);
  console.log(`Checkpoints: player ${await governanceTokenPlayer.numCheckpoints(player)}`);
  console.log(`Checkpoints: player2 ${await governanceTokenPlayer2.numCheckpoints(accounts[2].address)}`);

  //////////////
  const tx3 = await governanceToken.transfer(player, "11111111111");
  await tx3.wait(1);
  const tx24 = await governanceToken.transfer(accounts[2].address, "11111111111");
  await tx24.wait(1);

  console.log(`Checkpoints: player ${await governanceTokenPlayer.numCheckpoints(player)}`);
  console.log(`Checkpoints: player2 ${await governanceTokenPlayer2.numCheckpoints(accounts[2].address)}`);
};

module.exports.tags = ["all", "governorToken"];
