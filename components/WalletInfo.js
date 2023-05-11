import { Web3UserContext } from "../context";
import { shortenAddress } from "../utils/constants";
import icon from "../assets/images/copy-icon.svg";
import { chainIdToNetworkInfo, supportedChains } from "../utils/chainConfigs";
import { switchNetwork } from "../context/utils";

export default function WalletInfo() {
  const {
    contextState: {
      account,
      isWalletConnected,
      connectedChainId,
      hasMinterManagerRole,
      isRoleLoading,
      provider,
    },
  } = Web3UserContext();

  const isSupportedNetwork = supportedChains.includes(connectedChainId);

  const connectedChainName = isSupportedNetwork
    ? chainIdToNetworkInfo[connectedChainId].chainSymbol
    : "Unsupported network";

  const otherProvider =
    supportedChains[0] === connectedChainId
      ? supportedChains[1]
      : supportedChains[0];

  return (
    <>
      <div className="body-box">
        <div className="body-account-info-box">
          {isWalletConnected && (
            <>
              <h2 className="name-title">Connected Wallet</h2>
              <div className="wallet-flex-box">
                <p className="wallet-number mb-1">
                  {shortenAddress(account)}
                  &nbsp;&nbsp;
                  <picture>
                    <img className="wallet-copy-icon" src={icon.src} alt="" />
                  </picture>
                </p>
              </div>
              <div>
                {!isSupportedNetwork && (
                  <>
                    <button
                      onClick={switchNetwork.bind(
                        this,
                        provider,
                        otherProvider
                      )}
                      className="button-round btn btn-outline-secondary"
                    >
                      Switch Chain&nbsp;
                      {/* <picture>
                    <img
                      {...chainIdToNetworkInfo[otherProvider].icon}
                      alt="chain icon"
                      className="icon-img"
                    />
                  </picture> */}
                    </button>
                    <p className="text-danger">
                      Please Switch to Polygon network from your wallet.
                    </p>
                  </>
                )}
              </div>

              {!hasMinterManagerRole &&
                !isRoleLoading &&
                isSupportedNetwork && (
                  <p className="text-danger">
                    Your wallet does not have proper roles to access site.
                    Please connect a wallet with correct permissions
                  </p>
                )}
            </>
          )}
          {!isWalletConnected && (
            <div className="wallet-flex-box">
              <h3>Please connect your wallet</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
