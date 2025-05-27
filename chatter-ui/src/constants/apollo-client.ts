import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import excludedRoutes from './excluded-routes';
import router from '../components/Routes';


const LogoutLink = onError((error) => {
  if (error.graphQLErrors?.length) {
    if (!excludedRoutes.includes(window.location.pathname)) {
      router.navigate('/login');
      client.resetStore();
    }
  }
})

const httpLink = new HttpLink({ uri: `api/graphql`, })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: LogoutLink.concat(httpLink)
})

export default client;