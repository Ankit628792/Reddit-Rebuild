import { getProviders, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'

function signin({ providers }: { providers: [{ name: string, id: string }] }) {
    const router = useRouter()
    // Capture and Share the world's moments!
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-32 px-14 text-center">
                <img onClick={() => router.push('/')} className="w-60 2xl:w-80" src="/images/reddit_logo.png" alt=" " />
                <p className="text-lg max-w-md font-semibold text-gray-800 my-2">Dive into anything</p>
                <p className="text-sm max-w-md text-gray-600">Reddit is a network of communities where people can dive into their interests, hobbies and passions. There's a community for whatever you're interested in ...</p>
                <div className="">
                    {Object.values(providers).map((provider, i) => (
                        <div key={provider.name}>
                            <button className={`${i == 0 ? 'redditGradient' : 'googleGradient'} mt-8 rounded-lg text-white py-3 px-5 font-medium text-lg`} onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                                Sign in with {provider.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default signin

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}