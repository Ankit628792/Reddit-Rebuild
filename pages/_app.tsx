import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import Header from '../components/Header'
import { ApolloProvider } from '@apollo/client'
import client from '../applloClient'
import { Toaster } from 'react-hot-toast'
import Router from 'next/router'
import ProgressBar from '@badrap/bar-of-progress'

const progress = new ProgressBar({
  size: 3,
  className: "z-50 redditGradient",
  delay: 100
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Reddit 2.0</title>
        <link rel='icon' href="/reddit.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/reddit.png" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Reddit 2.0 - reddit clone." />
        <meta name="author" content="@ankit_628792" />
        <meta name='theme-color' content='#da2910' />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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
