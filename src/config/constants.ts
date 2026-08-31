export const TOKEN_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const DEPOSIT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DEPOSIT_CONTRACT_ADDRESS as `0x${string}`;

export const DEFAULT_RECEIVER_ADDRESS =
  (process.env.NEXT_PUBLIC_RECEIVER_ADDRESS || "") as `0x${string}`;
