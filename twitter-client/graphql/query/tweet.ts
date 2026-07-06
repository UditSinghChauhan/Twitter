import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      createdAt
      likesCount
      commentsCount
      likes {
        id
      }
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);

export const getSignedURLForTweetQuery = graphql(`
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`);

export const getTweetCommentsQuery = graphql(`
  query GetTweetComments($tweetId: ID!) {
    getTweetComments(tweetId: $tweetId) {
      id
      content
      createdAt
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);
