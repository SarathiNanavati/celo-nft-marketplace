import { Contract } from "ethers";
import { isAddress, parseEther } from "ethers/lib/utils";
import { useState } from "react";
import { erc721ABI, useSigner } from "wagmi";
import { MARKETPLACE_ADDRESS } from "../constants";
import styles from "../styles/Create.module.css";
import MarketplaceABI from "../abis/NFTMarketplace.json";
import Navbar from "../components/Navbar";
import Link from "next/link";

const Create = () => {
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showListingLink, setShowListingLink] = useState(false);

  const { data: signer } = useSigner();

  async function handleCreateListing() {
    try {
      setLoading(true);
      const isValidAddress = isAddress(nftAddress);
      if (!isValidAddress) {
        throw new Error("Invalid contract address");
      }

      await requestApproval();
      await createListing();

      setShowListingLink(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const requestApproval = async () => {
    const address = await signer.getAddress();
    const ERC721Contract = new Contract(nftAddress, erc721ABI, signer);
    const tokenOwner = await ERC721Contract.ownerOf(tokenId);
    if (tokenOwner.toLowerCase() !== address.toLowerCase()) {
      throw new Error(`You do not own this NFT`);
    }

    const isApproved = await ERC721Contract.isApprovedForAll(address, MARKETPLACE_ADDRESS);
    if (!isApproved) {
      console.log("Requesing approval over NFTs...");
      const approvalTxn = await ERC721Contract.setApprovalForAll(MARKETPLACE_ADDRESS, true);
      await approvalTxn.wait();
    }
  };

  const createListing = async () => {
    const MarketplaceContract = new Contract(MARKETPLACE_ADDRESS, MarketplaceABI, signer);
    const createListingTxn = await MarketplaceContract.createListing(
      nftAddress,
      tokenId,
      parseEther(price)
    );
    await createListingTxn.wait();
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <input
          type='text'
          placeholder='NFT Address 0x...'
          value={nftAddress}
          onChange={(e) => setNftAddress(e.target.value)}
        />
        <input
          type='text'
          placeholder='Token ID'
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type='number'
          placeholder='Price (in CELO)'
          value={price}
          onChange={(e) => {
            if (e.target.value === "") {
              setPrice("0");
            } else {
              setPrice(e.target.value);
            }
          }}
        />

        <button onClick={handleCreateListing} disabled={loading}>
          {loading ? "Loading..." : "Create"}
        </button>

        {showListingLink && (
          <Link href={`/${nftAddress}/${tokenId}`}>
            <a>
              <button>View Listing</button>
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

export default Create;
