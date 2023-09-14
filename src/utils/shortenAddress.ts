export const shortenAddress = (account: string) => {
  return `${account?.slice(0, 10)}...${account?.slice(-8)}`;
};
