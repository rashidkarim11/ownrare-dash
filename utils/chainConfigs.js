import ethIcon from "../assets/icons/eth.svg";
import plyIcon from "../assets/icons/poly.svg";

export const MINTER_ROLE_MANAGER =
  "0xd39ef77acb659bb0f6279b47de0b63de9c9695a0cbb3bcdf06dfb4c67a25b9ca"; //keccak256("MINTER_ROLE_MANAGER");

// for testing
export const supportedChains = ["0x13881"];

export const chainIdToNetworkInfo = {
  "0x89": {
    chainSymbol: "Polygon",
    blockExplorerUrl: "https://polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
    icon: plyIcon,
    gasStation: "https://gasstation-mainnet.matic.network/v2",

    // configs to add chain in wallet
    configs: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
    // deployed contract addresses
    contracts: {
      erc721Address: "",
      marketplaceAddress: "",
    },
  },
  "0x13881": {
    chainSymbol: "Mumbai",
    blockExplorerUrl: "https://mumbai.polygonscan.com",
    rpcUrl: "https://matic-mumbai.chainstacklabs.com",

    gasStation: "https://gasstation-mumbai.matic.today/v2",
    // configs to add chain in wallet
    configs: {
      chainId: "0x13881",
      chainName: "Mumbai",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
    // deployed contract addresses
    contracts: {
      marketplaceAddress: "0x88cb9d31731cde8785f2db7e2f0658a62d486805",
    },
  },
};
