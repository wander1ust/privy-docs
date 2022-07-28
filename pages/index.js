import { useState, useEffect, useContext } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import { useSession, SignOutLink } from "../components/Session"
// import { useDocTitle } from "../components/Editor"
import Layout from "../components/Layout"
// import { useDocTitle, DocTitleContext } from "./edit/doc"
import { EditorState } from 'draft-js';
import { connectToWallet, disconnectWallet, destroy, init } from './metamask-login.jsx';

export default function Home() {
    const router = useRouter();
    const session = useSession();
    const [address, setAddress] = useState(null);
    // const [session, setSession] = useState(null);
    const [client, setClient] = useState(null);
    // const [note, setNote] = useState('');
    const [doc, setDoc] = useState('');
    const [docs, setDocs] = useState('');
    const [title, setTitle] = useState("Untitled Doc");
    const [msg, setMsg] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty()); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    // ToDo: Refactor routes
    const linkToDocs = () => {
      router.push('/docs');
    }   
    const linktoEditor = () => {
      router.push('/edit/doc');
    }

   // Check if doc already exists (look up ID)
  
  // Create a new doc. Add to Privy docs
  // let newDoc = {
  //   "id": 1,
  //   "body": doc.toString()
  // };  
  const handleCreateDoc = async (e) => {
      linktoEditor();
  }
  
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
      "title": title,
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

  useEffect(() => {
    if (!session.siwe.token || !session.address) {      
      router.push('/login');
    }
    setAddress(address);
    console.log(doc);
    console.log(title);
    // console.log(useContext(DocTitleContext));
}, []);

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

    function htmlStringToHTML(htmlString) {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();
    
      // Change this to div.childNodes to support multiple top-level nodes.
      return div.childNodes;
    }

  /* [{"body":"<p>c</p>\n"},{"body":"<p>a</p>\n"},{"body":"<p>w</p>\n"},{"id":1,"body":"<p>w</p>\n"},{"id":1,"body":"<p>w</p>\n"},{"id":126,"body":"<p>w</p>\n"},{"id":7,"body":"<p>w</p>\n"}] */
  const showDocs = () => {
    if (!docs) return;
    return JSON.parse(docs).map((doc , i)=> {
      return (
        // <div className={styles.grid}>
          <a href='' className={styles.card}>
          <h2>{doc.title ? doc.title : `Doc ${i+1}`}</h2>
            {doc.body}
           {/* <p>{htmlStringToHTML(doc.body).toString}</p> */}
            </a>
    )
  }) }  

  return (
    <Layout>
    <div className={styles.container}>      
      {/* <main className={styles.main}>
        <h1 className={styles.title}>
          Privy &middot; Docs
        </h1> */}
      <div className={styles.grid}>
        {showDocs()}
      </div>

        <SignOutLink />

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
      {/* </main> */}

      <footer className={styles.footer}>

          <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={linktoEditor}>
                  <strong>📗 </strong> Go to Editor
                </button>      &nbsp;&nbsp;&nbsp;        
                
                 <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={handleCreateDoc}>
                  <strong>➕ </strong> New Doc
                </button>      &nbsp;&nbsp;&nbsp;
          {/* <button className={Object.assign({}, styles.button, styles.inlineBtn)} onClick={handleDeleteDoc}>
                  <strong>🗑 </strong>&nbsp; Delete Doc
                </button>      &nbsp;&nbsp;&nbsp;           */}
          {/* <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={linkToDocs}>
            <strong>💾 </strong>&nbsp; View Docs
          </button>   */}
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
    </Layout>
  )
}
