import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "urql";
import { useAccount } from "wagmi";
import Listing from "../components/Listing";
import Navbar from "../components/Navbar";
import { SUBGRAPH_URL } from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [listings, setListings] = useState();
  const [loading, setLoading] = useState(false);

  const { isConnected } = useAccount();

  async function fetchListings() {
    setLoading(true);
    const listingQuery = `
      query ListingQuery{
        listingEntities {
          id
          nftAddress
          tokenId
          price
          seller
          buyer
        }
      }
    `;

    const urqlClient = createClient({ url: SUBGRAPH_URL });

    const response = await urqlClient.query(listingQuery).toPromise();
    const listingEntities = response.data.listingEntities;
    const activeListings = listingEntities.filter((l) => l.buyer === null);
    setListings(activeListings);
    setLoading(false);
  }

  useEffect(() => {
    if (isConnected) {
      fetchListings();
    }
  }, []);

  return (
    <>
      <Navbar />
      {loading && isConnected && <span>Loading...</span>}
      <div className={styles.container}>
        {!loading &&
          listings &&
          listings.map((listing) => {
            return (
              <Link key={listing.id} href={`${listing.nftAddress}/${listing.tokenId}`}>
                <a>
                  <Listing
                    nftAddress={listing.nftAddress}
                    tokenId={listing.tokenId}
                    price={listing.price}
                    seller={listing.seller}
                  />
                </a>
              </Link>
            );
          })}
      </div>
    </>
  );
}
