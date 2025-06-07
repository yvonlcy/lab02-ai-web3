import { ethers } from "hardhat";

async function main() {
  // founded deployer ac
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // found Contract Factory
  const Message = await ethers.getContractFactory("Message");

  // deploy（constructor）
  const message = await Message.deploy();
  await message.waitForDeployment();

  // print the contract address
  console.log("Message contract deployed to:", await message.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
