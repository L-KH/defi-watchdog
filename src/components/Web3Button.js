import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Web3Button({ showBalance = true, showChain = true }) {
  return (
    <ConnectButton
      showBalance={showBalance}
      chainStatus={showChain ? 'icon' : 'none'}
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  );
}
