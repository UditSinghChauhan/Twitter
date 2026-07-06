export const types = `#graphql

    input CreateTweetData {
        content: String!
        imageURL: String
    }

    type Comment {
        id: ID!
        content: String!
        author: User
        createdAt: String
    }

    type Tweet {
        id: ID!
        content: String!
        imageURL: String
        createdAt: String

        author: User
        likes: [User]
        likesCount: Int
        comments: [Comment]
        commentsCount: Int
    }
`;
