export const shortenAddress = (account: string) => {
  return `${account?.slice(0, 8)}...${account?.slice(-6)}`;
};
