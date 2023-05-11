import { useEffect, useState } from "react";
import { BoaxUrl, getProfileURL } from "../configs/config";
import { Web3UserContext } from "../context";
import { shortenAddress } from "../utils/constants";

const MINTER_ROLE =
  "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

export function UserCard(props) {
  const { image, fullName, walletAddress } = props;

  const [{ hasMinterRole, hasRoleChecked }, setState] = useState({
    hasRoleChecked: false,
    hasMinterRole: false,
  });

  const {
    contextState: {
      account,
      isContractInitialized,
      marketplaceContract,
      connectedChainId,
    },
  } = Web3UserContext();

  const checkRole = async () => {
    console.log(MINTER_ROLE, walletAddress, "data");
    const hasMinterRole = await marketplaceContract.methods
      .hasRole(MINTER_ROLE, walletAddress)
      .call();

    console.log(hasMinterRole, "roleChecked");

    setState({ hasMinterRole, hasRoleChecked: true });
  };

  const grantRole = async (wallet) => {
    try {
      await marketplaceContract.methods
        .grantRole(MINTER_ROLE, wallet)
        .send({ from: account });

      setState({ hasMinterRole: true, hasRoleChecked: true });

      const fd = new FormData();
      fd.append("status", 1);
      fd.append("wallet_addresss", wallet);
      await BoaxUrl.post("admin/api/creators/approveAdmin.php", fd);
    } catch (err) {
      throw err;
    }
  };

  const revokeRole = async (wallet) => {
    try {
      await marketplaceContract.methods
        .revokeRole(MINTER_ROLE, wallet)
        .send({ from: account });

      setState({ hasMinterRole: false, hasRoleChecked: true });
      const fd = new FormData();
      fd.append("status", 0);
      fd.append("wallet_addresss", wallet);
      await BoaxUrl.post("admin/api/creators/unapproveAdmin.php", fd);
    } catch (err) {}
  };

  const onClickMangeRole = async () => {
    if (hasMinterRole) await revokeRole(walletAddress);
    else await grantRole(walletAddress);

    checkRole();
  };

  useEffect(() => {
    isContractInitialized && checkRole();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContractInitialized, connectedChainId]);

  return (
    <div className="products-flex-box">
      <div className="one-of-product-box">
        <div className="product-flex-box">
          <div className="product-image-box">
            <picture>
              <img
                className="product-image"
                src={getProfileURL(image)}
                alt={fullName}
                width="100%"
              />
            </picture>
          </div>
          <div className="product-info-box">
            <div className="product-name-boxes">
              <p className="product-name">{fullName}</p>
            </div>
            <div className="product-name-boxes">
              <p className="product-name">{shortenAddress(walletAddress)}</p>
            </div>
            <div className="product-time-boxes">
              <div className="pro-traverse-button-box">
                {hasRoleChecked && (
                  <button
                    className="pro-traverse-button"
                    onClick={onClickMangeRole}
                  >
                    <span className="pro-traverse-button-text">
                      {hasMinterRole && "Revoke Minter Role"}

                      {!hasMinterRole && " Approve Minter Role"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
