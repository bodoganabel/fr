import gql from "graphql-tag";

export const producerTypes = gql`
    type Producer {
        _id: String!
        name: String!
        country: String
        region: String
    }
`;

export interface IProducer {
    _id: string;
    name: string;
    country: string;
    region: string;
}