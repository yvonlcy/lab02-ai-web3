import { ethers } from "hardhat";

async function main() {
  // Get contract factory
  const Message = await ethers.getContractFactory("Message");
  
  // Attach to deployed contract
  const message = Message.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

  // Set a new message
  await message.setMessage("New AI-powered message");
  
  // Get current message
  const currentMessage = await message.currentMessage();
  console.log("Current message:", currentMessage.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
