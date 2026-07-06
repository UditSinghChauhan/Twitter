export const queries = `#graphql
    getAllTweets: [Tweet]
    getSignedURLForTweet(imageName: String!, imageType: String!): String
    getTweetComments(tweetId: ID!): [Comment]
`;
