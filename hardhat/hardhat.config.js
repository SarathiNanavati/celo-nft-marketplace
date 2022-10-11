require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY environment variable");
}

if (!RPC_URL) {
  console.error("Missing RPC_URL environment variable");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    // mumbai: {
    //    url: ALCHEMY_API_KEY_URL,
    //    accounts: [MUMBAI_PRIVATE_KEY],
    // },
    // goerli: {
    //   url: QUICKNODE_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    // },
    alfajores: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  // etherscan: {
  //   apiKey: {
  //     polygonMumbai: POLYGONSCAN_KEY,
  //     goerli: ETHERSCAN_KEY,
  //   },
  // },
};

// Celo NFT deployed @ 0x3C427C0496eA94D4B02073714e2471cdB9BC215B
// NFT Marketplace deployed @ 0x3A40E12405Cc14714B4C2C8C677df679a85b4c95
