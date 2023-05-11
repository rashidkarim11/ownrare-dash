import { useEffect, useState } from "react";
import { UserCard } from "../components/UserCard";
import WalletInfo from "../components/WalletInfo";
import { BoaxUrl } from "../configs/config";
import { Web3UserContext } from "../context";

export default function Index() {
  const [
    { creators, currentPage, totalCreators, totalPages, isLoading },
    setState,
  ] = useState({
    creators: [],
    currentPage: null,
    totalCreators: null,
    totalPages: null,
    isLoading: false,
  });
  useEffect(() => {
    (async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      const users = await getArtists();
      setState({ ...users, isLoading: false });
    })();
  }, []);

  const {
    contextState: { isWalletConnected, hasMinterManagerRole },
  } = Web3UserContext();

  const loadMore = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const users = await getArtists(currentPage + 1);

    setState((prev) => ({
      ...prev,
      ...users,
      creators: [...prev.creators, ...users.creators],
      isLoading: false,
    }));
  };
  return (
    <section>
      <WalletInfo />

      {hasMinterManagerRole && isWalletConnected && (
        <div className="body-box">
          <div className="products-big-start">
            <div className="products-start">
              <div className="cards-grid">
                {creators &&
                  creators.map(
                    ({ creator_img, fullName, id, walletAddress }) => (
                      <UserCard
                        key={id}
                        image={creator_img}
                        fullName={fullName}
                        walletAddress={walletAddress}
                      />
                    )
                  )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-5 mb-5">
            {isLoading && <p>Loading...</p>}

            {!isLoading && currentPage < totalPages && (
              <button onClick={loadMore} className="btn btn-primary">
                Load More
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const getArtists = async (pageno = 1) => {
  try {
    const { data } = await BoaxUrl.get("admin/api/creators/creators.php", {
      params: {
        pageno,
      },
    });
    return data;
  } catch (err) {
    return {
      Creators: [],
      currentPage: null,
      totalCreators: null,
      totalPages: null,
    };
  }
};
