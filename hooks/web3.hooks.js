import { useEffect, useRef } from "react";
import { Web3UserContext } from "../context";
import { TYPES } from "../context/reducer";
import {
  chainIdToNetworkInfo,
  MINTER_ROLE_MANAGER,
  supportedChains,
} from "../utils/chainConfigs";

export const useOnAppLoad = () => {
  const { initializePackages } = Web3UserContext();

  useEffect(() => {
    initializePackages();
    // eslint-disable-next-line
  }, []);
};

/**
 * @dev it will listen to provder events and update the states.
 * @returns void
 */
export const useOnProviderChange = () => {
  const {
    dispatch,
    getNetworkInfo,
    contextState: { provider },
  } = Web3UserContext();

  useEffect(() => {
    provider &&
      (async () => {
        // Subscribe to accounts change

        provider.on("accountsChanged", (accounts) => {
          if (accounts && accounts.length)
            return dispatch({
              type: TYPES.UPDATE_STATE,
              payload: { account: accounts[0], isWalletConnected: true },
            });
          dispatch({
            type: TYPES.UPDATE_STATE,
            payload: {
              account: null,
              isWalletConnected: false,
            },
          });
        });

        provider.on("chainChanged", getNetworkInfo);

        await getNetworkInfo();
      })();

    // eslint-disable-next-line
  }, [provider]);
};

export const useInitContract = () => {
  const {
    initializeContract,
    contextState: { connectedChainId, isWalletConnected, web3Instance },
  } = Web3UserContext();

  useEffect(() => {
    const isCorrectChain = supportedChains.includes(connectedChainId);

    isWalletConnected &&
      isCorrectChain &&
      (() => {
        const address =
          chainIdToNetworkInfo[connectedChainId].contracts.marketplaceAddress;
        address && initializeContract(address);
      })();
    // eslint-disable-next-line
  }, [isWalletConnected, connectedChainId, web3Instance]);
};

// checks the wallet connection status and update state if wallet is connected on page refresh
export const useCheckWalletConnection = () => {
  const hasBeenChecked = useRef(false);

  const {
    walletConnect,
    contextState: { web3PackagesLoaded },
  } = Web3UserContext();

  useEffect(() => {
    const isConnected = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
    if (web3PackagesLoaded && isConnected && !hasBeenChecked.current) {
      walletConnect();
      hasBeenChecked.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3PackagesLoaded]);
};

export const useCheckWalletRole = () => {
  const {
    dispatch,
    contextState: {
      account,
      isContractInitialized,
      isWalletConnected,
      marketplaceContract,
    },
  } = Web3UserContext();

  useEffect(() => {
    isContractInitialized &&
      isWalletConnected &&
      (async () => {
        dispatch({
          type: TYPES.UPDATE_STATE,
          payload: {
            isRoleLoading: true,
          },
        });
        try {
          const hasRole = await marketplaceContract.methods
            .hasRole(MINTER_ROLE_MANAGER, account)
            .call();

          dispatch({
            type: TYPES.UPDATE_STATE,
            payload: {
              hasMinterManagerRole: hasRole,
              isRoleLoading: false,
            },
          });
        } catch (err) {
          dispatch({
            type: TYPES.UPDATE_STATE,
            payload: {
              isRoleLoading: false,
            },
          });
        }
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContractInitialized, account, isWalletConnected]);
};
