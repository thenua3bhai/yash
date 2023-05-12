import { ethers, upgrades } from "hardhat";

async function main() {
  const boxV2 = await ethers.getContractAt("BoxV2", "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0");
  const tx = await boxV2.increment();
  const txReceipt = await tx.wait(1);
  // const value = await txReceipt.events[0].args[1].newValue.toString();
  // console.log("value is", value);
  console.log(txReceipt.events[0].args.newValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
