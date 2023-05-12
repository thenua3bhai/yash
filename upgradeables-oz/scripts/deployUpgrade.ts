import { ethers, upgrades } from "hardhat";

async function main() {
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  let boxProxy = await upgrades.upgradeProxy("0xCfb73a232A9EFFf6af8A1FcDB87a4361BF380bd", BoxV2);
  console.log("Your upgraded proxy is done!", boxProxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
