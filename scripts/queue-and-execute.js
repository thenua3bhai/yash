const { ethers, network } = require("hardhat");
const { developmentChains, FUNC, PROPOSAL_DESCRIPTION, NEW_STORE_VALUE, MIN_DELAY } = require("../helper-hardhat-config");
// const fs = require("fs");
const { moveBlocks } = require("../utils/move-blocks");
const { moveTime } = require("../utils/move-time");

async function queueAndExecute() {
  const args = [NEW_STORE_VALUE];
  const functionToCall = FUNC;
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing...");
  const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash);
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing...");
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute([box.address], [0], [encodedFunctionCall], descriptionHash);
  await executeTx.wait(1);
  console.log(`Box value: ${await box.retrieve()}`);
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
