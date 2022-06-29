import NextAuth from "next-auth/next";
import RedditProvider from 'next-auth/providers/reddit'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
    providers: [
        RedditProvider({
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    //creating your own customized sigin page
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        // @ts-ignore
        async session({ session }) {
            // @ts-ignore
            session.user.name = session.user.name.split(" ").join("").toLocaleLowerCase();
            return session;
        }
    }
})