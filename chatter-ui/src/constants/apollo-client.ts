import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { API_URL } from './url';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `api/graphql`,
})

export default client;