import { ethers, upgrades } from "hardhat";

// scripts/prepare_upgrade.js
async function main() {
  const proxyAddress = "0xCfb73a232A9EFFf6af8A1FcDB87a4361BF380bd4";

  const BoxV2 = await ethers.getContractFactory("BoxV2");
  console.log("Preparing upgrade...");
  const boxV2Address = await upgrades.prepareUpgrade(proxyAddress, BoxV2);
  console.log("BoxV2 at:", boxV2Address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
