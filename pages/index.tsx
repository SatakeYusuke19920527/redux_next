import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link'
// import './index.css';
// import App from '../src/App';
import { store } from '../src/app/store';
import { Provider } from 'react-redux';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import User from '../components/User'
const fetcher = (url: string) => fetch(url).then((res) => res.json())
const App = dynamic(
  () => import('../src/App'),
  { ssr: false }
)
const PageAA = dynamic(
  () => import('../src/PageAA'),
  { ssr: false }
)
const PageB = dynamic(
  () => import('../src/PageB'),
  { ssr: false }
)

const Home: NextPage = () => {
  const router = useRouter()
  const toPageA = () => {
    router.push('./PageA')
  }

  const { data, error } = useSWR('/api/users', fetcher)
  console.log({ data })
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  // const [name, setName] = useState<string>('');
  const fetchAPI = async () => {
    const name: string = 'hogehoge';
    const response = await fetch(`http://localhost:3000/api/[${name}]`);
    const data = await response.json();
    console.log(data);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p className={styles.description}>
          {/* Get started by editing{' '} */}
          <button onClick={toPageA}>
            <React.StrictMode >
              <Provider store={store}>
                <PageAA />
              </Provider>
            </React.StrictMode>
          </button>
          <button onClick={fetchAPI}>
            fetchAPI
          </button>
          {/* <code className={styles.code}>pages/index.tsx</code> */}
        </p>

        <section className="h-screen w-4/5 max-w-5xl mx-auto flex items-center justifycenter flex-col">
          {/* <h1 className="mb-4 text-green-500 text-3xl">サンプル</h1> */}
          {/* ReactDOM.render( */}
          <React.StrictMode >
            <Provider store={store}>
              <App />
            </Provider>
          </React.StrictMode>
          <div>
            {data.map((p: any, id: any) => (
              <User key={id} user={p} />
            ))}
          </div>
        </section>
        <div className={styles.grid}>
          {/* <Link href="http://localhost:3000/PageA">pageA</Link> */}
          <p>
            Instantly deploy your Next.js site to a public URL with Vercel.
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home