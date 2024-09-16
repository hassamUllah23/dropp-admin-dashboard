const url = "https://server.dropp-phygital.com";
export const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || `${url}/api/v1`;
export const NEXT_PUBLIC_CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "https://devnet.droppthink.com/api";
export const NEXT_PUBLIC_SOCKET_URL = `${url}`;
