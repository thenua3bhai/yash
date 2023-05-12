import { upgrades } from "hardhat";

// scripts/transfer_ownership.js
async function main() {
  const gnosisSafe = "0xC8ad7d0827Fa15503d7adDCf4E952d1a6dC9A69a";

  console.log("Transferring ownership of ProxyAdmin...");
  // The owner of the ProxyAdmin can upgrade our contracts
  await upgrades.admin.transferProxyAdminOwnership(gnosisSafe);
  console.log("Transferred ownership of ProxyAdmin to:", gnosisSafe);
  //is script ko cjlana eke bad hm admin contract pr kuch n kr pa rher na upgrade contract na owner change kyuki ye gnosis safe ka acc. uska owner h h and wh se kese txn bheje pta nhi..n hmpe admin ka address h n uski abi.. n uska jo owner h usse txn bhej pa rhe h halwqa bn gya h ...gnosis safe ne open zeplin ka option hara diya h jo turorial m tha..
  //yha gnosis safe ki jagh openzepplin ka defender uase krna admin contract ka owner bnanae ke liye...usme sb smjhna contract kese co0ntrl and call kre
  //ye upgrades se proxy admina nd implenetaimon ke  bhi adsdress nikln a sekho and abi bhi kya deploy kiya h admin ka..

  //
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
