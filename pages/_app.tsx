import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import Header from '../components/Header'
import { ApolloProvider } from '@apollo/client'
import client from '../applloClient'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Reddit 2.0</title>
        <link rel="icon" href="/images/reddit_logo_sm.svg" />
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <div className='h-screen overflow-y-scroll bg-slate-200'>
            <Header />
            <Component {...pageProps} />
            <div><Toaster /></div>
          </div>
        </SessionProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
