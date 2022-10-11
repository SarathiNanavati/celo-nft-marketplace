const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const CeloNFTFactory = await ethers.getContractFactory("CeloNFT");
  const celoNftContract = await CeloNFTFactory.deploy();
  await celoNftContract.deployed();
  console.log("Celo NFT deployed @", celoNftContract.address);

  const NFTMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplaceContract = await NFTMarketplaceFactory.deploy();
  await nftMarketplaceContract.deployed();
  console.log("NFT Marketplace deployed @", nftMarketplaceContract.address);

  // console.log("Verify Contract Address:", proxyContract.address);
  // console.log("Sleeping 60 Seconds.....");
  // await sleep(60000);

  // await hre.run("verify:verify", {
  //    address: deployedRandomWinnerGameContract.address,
  //    constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE],
  // });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
