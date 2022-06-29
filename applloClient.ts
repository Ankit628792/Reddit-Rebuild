import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://zhangzhou.stepzen.net/api/reddit/__graphql',
    headers: {
        "Authorization": `APIKey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`,
        "Content-Type": "application/json"
    },
    cache: new InMemoryCache()
})

export default client