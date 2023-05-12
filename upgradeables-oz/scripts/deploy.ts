import { ethers, upgrades } from "hardhat";

async function main() {
  const Box = await ethers.getContractFactory("Box");
  console.log("Deploying Box...");
  const boxProxy = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  console.log("Box proxy with Box and admin deployed to:", boxProxy.address);
  // console.log(boxProxy);
  // const address = await ethers.getContractAt("Box");
}

/**
 * $ npx hardhat console --network goerli
> const Box = await ethers.getContractFactory("Box")
undefined
> const box = await Box.attach("0xFF60fd044dDed0E40B813DC7CE11Bed2CCEa501F")
//new ,method on contract factory to attach with address to give instance
undefined
> (await box.retrieve()).toString()
'42'
 */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
