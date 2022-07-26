import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import { useSession, SignOutLink } from "../components/Session"
import { EditorState } from 'draft-js';
import { connectToWallet, disconnectWallet, destroy, init } from './metamask-login.jsx';

const SimpleEditor = dynamic(() => import( '../components/Editor.jsx' ), { ssr: false } );

export default function Home() {
    const router = useRouter();
    const session = useSession();
    const [address, setAddress] = useState(null);
    // const [session, setSession] = useState(null);
    const [client, setClient] = useState(null);
    // const [note, setNote] = useState('');
    const [doc, setDoc] = useState('');
    const [docs, setDocs] = useState('');
    const [msg, setMsg] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty()); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const linkToDocs = () => {
      router.push('/docs');
    }

   // Check if doc already exists (look up ID)
  
  // Store note in Privy
  const handleSaveDoc = async (e) => {
  // if (!address) {alert('Connect your wallet to create and edit notes.');}
  try {
      // e.preventDefault();
      console.log('pud address:' + session.address);  // null
      const [htmlDocs] = await session.privy.put(session.address, [
        {
          field: 'docs', // json (arr of doc objects)
          value: JSON.stringify(generateDocsJson())
          // value: generateDocsJson()
          // value: JSON.stringify( [{
          //   body: doc
          // }])
          // value: ''
        }
      ])
      setMsg('Doc saved!');
      // setDocs(htmlDocs);
      // .then(() => {console.log(address)});
      setDocs(htmlDocs?.text());
      console.log(htmlDocs?.text());      
    } catch(e) {
      console.log(e);
    }
  };

  const isDocsEmpty = docs.length == 0;

  // [{"body":"<p>c</p>\n"}]
  const generateDocsJson = () => {
    let arr = [];
    let docToSave = {
      "id": 1,
      "body": doc.toString()
    };  
    let res = new Array(docToSave);
    // console.log(docs.length); // string, 0 length
      if (!isDocsEmpty) {          
          const savedDocs = JSON.parse(docs);
          docToSave.id = savedDocs.length + 1
          res = [...savedDocs, docToSave];
          // res = savedDocs.push(docToSave);
    }
    return res;
  }

  // Temp
  const handleDeleteDoc = async () => {
    // const [htmlNote] = await session.privy.put(session.address, [
    //   {
    //     field: "html-note",
    //     value: ""
    //   }
    // ])
}

  // const deleteNote = async () => {
  //   return;
  // }

  useEffect(() => {
    // if (!session.address) {
    //   connectToWallet(session, setAddress);
    // }
    if (!session.siwe.token || !session.address) {      
      router.push('/login');
    }
      // /* Sometimes address is null after user has signed in
      // Reprompt login if this occurs */
      // if (session.address == null) {
      //   router.push('/login');
      // }
    setAddress(address);
    console.log(doc);
}, []);

  // Update address if page is refreshed.
  // const updateAddress = async () => {
  //   const address = await session.address();
  //   setAddress(address);
  // };
  // useEffect(() => {
  //     updateAddress();
  //     // init(PrivyClient, SiweSession, setSession).then(() => {updateAddress});
  // }, []);

  // useEffect(() => {
  //   async function getNote() {
  //     try {
  //       // Fetch user's note from Privy
  //       const [note] = await session.privy.get(
  //         session.address,
  //         ["html-note"]
  //       );
  //       console.log(`Existing note: ${note}`);
  //       setNote(note);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getNote();
  // }, [session]);    
  // ORIGINAL
  // useEffect(() => {
    async function getDocsFromPrivy() {
        try {
          const htmlDocs = await session.privy.get(
                  session.address, // null - why?
                  "docs"
                );
                setDocs(htmlDocs?.text());
              //  setDocs(htmlDocs !== null ? htmlDocs.text() : 'N/A');
              // console.log('address: ' + session.address);
              console.log('getDocsFromPrivy: ' + (htmlDocs !== null ? htmlDocs.text() : 'null'));
              // console.log(`doc: ${doc}`);
              // console.log(`doc: ${JSON.stringify(htmlNote)}`);
        } catch (error) {
          console.log(error);
        }
    }
  //   getDocFromPrivy();
  // }, [session]);

    useEffect(() => {
      getDocsFromPrivy();
    }, [session, docs]);

      // Get user data from Privy.
      // const getPrivyData = async () => {
      //   try {
      //     if (!address) return;
      //     const [htmlNote] = await client.get(
      //       address,
      //       ["html-note"]
      //     );
      //     setDoc(htmlNote);
      //     console.log(`Get doc: ${doc}`);
    
      //   } catch (error) {
      //     console.error(error);
      //   }
      // };
  
    // Get the user data from Privy whenever the wallet address is set.
    // useEffect(() => {
    //   getPrivyData();
    // }, [address]);
    //  END

  // Get user data from Privy.
  // const getUserData = async () => {
  //     try {
  //       if (!session.siwe.token || !session.address) return;

  //       // Fetch user's note from Privy
  //       const [note] = await session.privy.get(
  //         session.address,
  //         ["html-note"]
  //       );
  //       console.log(`Existing note: ${note}`);

  //     } catch (error) {
  //       console.error(error);
  //     }
  // };

  // Get the user data from Privy whenever the wallet address is set.
  // useEffect(() => {
  //         /* Sometimes address is null after user has signed in
  //     Reprompt login if this occurs */
  //     // if (address === null) {
  //     //   router.push('/login');
  //     // }
  //     async () => {
  //         const doc = await getUserData().then((note) => {console.log(note)});
  //         setDoc(doc);
  //         console.log(`Get doc: ${doc}`);
  //       // getUserData().then((note) => {console.log(note)});
  //     }
  // }, [address]);

  // Show note as it is updated
  // useEffect(() => {
  //     if (!doc) return;
  //     // console.log(`doc: ${JSON.stringify(doc)}`);
  // }, [doc]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Privy Docs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Privy &middot; Docs
        </h1>

        <SignOutLink />

        <SimpleEditor style={{clear: 'both'}} doc={doc} setDoc={setDoc} editorState={editorState} setEditorState={setEditorState} />

        {/* <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>

      {/* onClick={() => {address ? putUserData : alert('Connect your wallet to create and edit notes.')}} */}
      {/* <Login setAddress={setAddress} /> */}
      {/* () => {connectToWallet; handleBtnClick();} */}
      <footer className={styles.footer}>
      {/* <button onClick={() => {connectToWallet(session, setAddress)}}>Connect Wallet</button> */}
      {/* <button onClick={() => {disconnectWallet(session, setAddress, useSession, destroy)}}>Log out</button> */}
      
      <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={handleSaveDoc}>
              <strong>💾 </strong>&nbsp; Save Doc
            </button>      &nbsp;&nbsp;&nbsp;
      <button className={Object.assign({}, styles.button, styles.inlineBtn)} onClick={handleDeleteDoc}>
              <strong>🗑 </strong>&nbsp; Delete Doc
            </button>      &nbsp;&nbsp;&nbsp;          
      <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={linkToDocs}>
        <strong>💾 </strong>&nbsp; View Docs
      </button>  
        <h5>{msg}</h5>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  )
}
