import React, { FC } from "react";
import Head from "next/head";
// import styles from '../styles/Home.module.css'
import styles from "../styles/Layout.module.css";

// interface Props {
//   children;
// }

const Layout = ({ children }) => {
  return (
    <>
    <Head>
        <title>Privy Docs</title>  {/* ToDo: Link to root home page */}
        <meta name="description" content="Create and share encrypted docs between Ethereum wallet addresses. Powered by Privy." />
        <link rel="icon" href="/favicon.ico" />       
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Privy &middot; Docs
        </h1>
      
      </main>
      {children}
    </>
  )
}

export default Layout;