export const muatations = `#graphql
    createTweet(payload: CreateTweetData!): Tweet
    deleteTweet(tweetId: ID!): Boolean
    likeTweet(tweetId: ID!): Tweet
    unlikeTweet(tweetId: ID!): Tweet
    addComment(tweetId: ID!, content: String!): Comment
`;
