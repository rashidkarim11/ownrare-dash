import {
  useCheckWalletConnection,
  useCheckWalletRole,
  useInitContract,
  useOnAppLoad,
  useOnProviderChange,
} from "./web3.hooks";

export default function HooksWrapper() {
  useOnAppLoad();
  useOnProviderChange();
  useCheckWalletConnection();
  useInitContract();
  useCheckWalletRole();
  return null;
}
