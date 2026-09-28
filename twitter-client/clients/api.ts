import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

// On the server (SSR), prefer the internal URL so requests resolve inside the
// Docker network; the browser always uses the public URL.
const apiUrl = isClient
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;

export const graphqlClient = new GraphQLClient(apiUrl as string, {
  headers: () => ({
    Authorization: isClient
      ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
      : "",
  }),
});
