import { loadWeb3Packages } from "./utils";
import { TYPES } from "./reducer";
import marketPlaceABI from "../assets/abis/BoaxMarketplace.json";
import { chainIdToNetworkInfo } from "../utils/chainConfigs";

export default function actions(state, dispatch = () => {}) {
  const { web3Instance, provider, web3Modal, Web3, isWalletConnected } = state;
  // loads web packages
  const initializePackages = async () => {
    const { web3Modal, Web3 } = await loadWeb3Packages();
    dispatch({
      type: TYPES.UPDATE_STATE,
      payload: {
        web3Modal,
        Web3,
        web3PackagesLoaded: true,
      },
    });
  };

  const initializeContract = (address) => {
    const marketplaceContract = new web3Instance.eth.Contract(
      marketPlaceABI,
      address
    );

    dispatch({
      type: TYPES.UPDATE_STATE,
      payload: {
        marketplaceContract,
        isContractInitialized: true,
      },
    });
  };

  /**
   * @dev it will popup web3 modal and gets user wallet address once they select provider.
   * @returns void
   */
  const walletConnect = async () => {
    if (!web3Modal || isWalletConnected) return;
    const provider = await web3Modal.connect();
    const web3Instance = new Web3(provider);
    let account = (await web3Instance.eth.getAccounts())[0];

    if (!account) {
      await provider.request({
        method: "eth_requestAccounts",
      });
      account = (await web3Instance.eth.getAccounts())[0];
    }

    dispatch({
      type: TYPES.UPDATE_STATE,
      payload: {
        isWalletConnected: true,
        account,
        provider,
        web3Instance,
      },
    });
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    dispatch({
      type: TYPES.UPDATE_STATE,
      payload: {
        account: null,
        isWalletConnected: false,
      },
    });
  };

  const getNetworkInfo = async () => {
    const chainId = await provider.request({
      method: "eth_chainId",
    });

    dispatch({
      type: TYPES.UPDATE_STATE,
      payload: {
        connectedChainId: chainId,
        isContractInitialized: false,
      },
    });
  };

  return {
    // custom actions
    initializePackages,
    walletConnect,
    disconnectWallet,
    getNetworkInfo,
    initializeContract,
    // navtie state and dispatch
    contextState: state,
    dispatch,
  };
}
