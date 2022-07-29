import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import { useSession, SignOutButton } from "../components/Session";
// import { useDocTitle } from "../components/Editor"
import Layout from "../components/Layout";
// import { useDocTitle, DocTitleContext } from "./edit/doc"
import { EditorState } from 'draft-js';
import { PRIVY_API_KEY } from "../config";
import { connectToWallet, disconnectWallet, destroy, init } from './metamask-login.jsx';

export default function Home() {
    const router = useRouter();
    const session = useSession();
    const [address, setAddress] = useState(null);
    // const [session, setSession] = useState(null);
    // const [client, setClient] = useState(null);
    const [view, setView] = useState(null);
    // const [note, setNote] = useState('');
    const [docId, setDocId] = useState('');
    const [doc, setDoc] = useState('');
    const [docs, setDocs] = useState('');
    const [title, setTitle] = useState('');
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
  /* Event handlers */
  const onCreateDoc = async (e) => {
      linktoEditor();
  }  
  const onDeleteDoc = async (e, id) => {
    // if (!docs) return;
    console.log(id.i); // num
    var filteredDocs = JSON.parse(docs).filter(doc => {
      console.log(doc.id);
      return doc.id-1 != id.i;
    })
    // console.log(e.parentNode.id);
    console.log(filteredDocs);
    const [htmlDocs] = await session.privy.put(session.address, [
      {
        field: "docs",
        value: JSON.stringify(filteredDocs)
      }
    ])
    setDocs(htmlDocs?.text());
  }
  const onDeleteDocs = async (e) => {
    // ToDo: trigger dialog; warn user that permanent deletion cannot be undone
    await session.privy.del(session.address, 'docs');
    router.push('/');
    setMsg('Docs successfully deleted!')
  }

  // Data is encrypted
  const onViewShared = async (e) => {
    // Get docs from sharer. Use privy-node with Node.js instead.
    const sharedDocs = await session.privy.get('0xe5Af738efD11737EC3e6cF7Dc9237f538402bd6d', 'docs');
     console.log(JSON.stringify(docs));
    // Save docs to user account
     const copySharedDocs = await session.privy.put(session.address, 'docs', docs);
     console.log(copySharedDocs);
  }
  
    // Store note in Privy
  // const handleSaveDoc = async (e) => {
  // // if (!address) {alert('Connect your wallet to create and edit notes.');}
  // try {
  //     // e.preventDefault();
  //     console.log('pud address:' + session.address);  // null
  //     const [htmlDocs] = await session.privy.put(session.address, [
  //       {
  //         field: 'docs', // json (arr of doc objects)
  //         value: JSON.stringify(generateDocsJson())
  //         // value: generateDocsJson()
  //         // value: JSON.stringify( [{
  //         //   body: doc
  //         // }])
  //         // value: ''
  //       }
  //     ])
  //     setMsg('Doc saved!');
  //     // setDocs(htmlDocs);
  //     // .then(() => {console.log(address)});
  //     setDocs(htmlDocs?.text());
  //     console.log(htmlDocs?.text());      
  //   } catch(e) {
  //     console.log(e);
  //   }
  // };

  // const isDocsEmpty = docs?.length == 0;

  // // [{"body":"<p>c</p>\n"}]
  // const generateDocsJson = () => {
  //   let arr = [];
  //   let docToSave = {
  //     "id": 1,
  //     "title": title,
  //     "body": doc.toString()
  //   };  
  //   let res = new Array(docToSave);
  //   // console.log(docs.length); // string, 0 length
  //     if (!isDocsEmpty) {          
  //         const savedDocs = JSON.parse(docs);
  //         docToSave.id = savedDocs.length + 1
  //         res = [...savedDocs, docToSave];
  //         // res = savedDocs.push(docToSave);
  //   }
  //   return res;
  // }

//   // Temp
//   const handleDeleteDoc = async () => {
//     // const [htmlNote] = await session.privy.put(session.address, [
//     //   {
//     //     field: "html-note",
//     //     value: ""
//     //   }
//     // ])
// }

// Reset docs for testing
const test = async () => {
    await session.privy.put(session.address, [
      {
        field: "docs",
        value: "[{'id': 1, 'title': title}]"
      }])
}

  useEffect(() => {
    if (!session.siwe.token || !session.address) {      
      router.push('/login');
    }
    setAddress(address);
    setView('home');
    // test();
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
              localStorage.setItem('docs', htmlDocs);
              console.log(`Local storage docs: ${localStorage.getItem(docs)}`);
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

    // const replaceDoubleQuotesWithSingle = (str) => {
    const replaceChar = (str, charToReplace, replacedWith) => {
        return str.replace(/charToReplace/g, replacedWith);
        // return str.replace(/["']/g, "''");
        // return str.replace(/blue/g, "red");
    }

  /* [{"body":"<p>c</p>\n"},{"body":"<p>a</p>\n"},{"body":"<p>w</p>\n"},{"id":1,"body":"<p>w</p>\n"},{"id":1,"body":"<p>w</p>\n"},{"id":126,"body":"<p>w</p>\n"},{"id":7,"body":"<p>w</p>\n"}] */
  const showDocs = () => {
    if (!docs) return;
    // ToDo: Check if docs is JSON
    // if (!Array.isArray(docs)) return;
    return JSON.parse(docs).map((doc , i)=> {
      return (
        // <div className={styles.grid}>
        // `edit/doc?id=${i+1}`
          // <a href={`edit/doc/${i+1}?token=${session.siwe.token}&htmlDoc=${JSON.stringify(JSON.parse(docs))}`} className={styles.card} target='_blank'>
          /* <a href={`edit/doc/${i+1}?myDocs=${replaceDoubleQuotesWithSingle(JSON.stringify(JSON.parse(docs)[i]))}`} className={styles.card} target='_blank'> */
          /* <a href={`edit/doc/${i+1}?myDocs=${replaceChar(JSON.stringify(JSON.parse(docs)[i])), /&nbsp;/gi, 'ok'}`} className={styles.card} target='_blank'> */
            <>
                <a href={`edit/doc/${i+1}?myDocs=${JSON.stringify(JSON.parse(docs)[i].body)}`} className={styles.card} target='_blank'>
                {/* <a href={`edit/doc/${i+1}?myDocs=${docs}`} className={styles.card} target='_blank'> */}
              <h2>{doc.title.toLowerCase() !== 'untitled' ? doc.title : `Doc ${i+1}`} </h2>
             
                {doc.body}
                {/* <p>{htmlStringToHTML(doc.body).toString}</p> */}
                </a>
                <a className={styles.deleteDoc} onClick={(e) => {onDeleteDoc(e, {i})}}><span className={styles.deleteIcon}>🗑</span></a>
                </>
    )
  }) }  

  return (
    <Layout>
      {/* <div className={styles.wrapper}> */}
       {/* <img className={styles.backgroundImg} src='../public/imgs/pink-dark.jpg' /> */}
    <div className={styles.container}>      
      {/* <main className={styles.main}>
        <h1 className={styles.title}>
          Privy &middot; Docs
        </h1> */}
      <div className={styles.grid}>
        {showDocs()}
      </div>

       

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

          <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={onDeleteDocs}>
                  <strong>📗 </strong> Delete Docs
                </button>      &nbsp;&nbsp;&nbsp;     
          <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={linktoEditor}>
                  <strong>📗 </strong> Go to Editor
                </button>      &nbsp;&nbsp;&nbsp;        
                
                 <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={onCreateDoc}>
                  <strong>➕ </strong> New Doc
                </button>      &nbsp;&nbsp;&nbsp;                 
                <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={onViewShared}>
                  <strong>➕ </strong> Shared with Me
                </button>      &nbsp;&nbsp;&nbsp;
                <SignOutButton view={'home'} />
          {/* <button className={Object.assign({}, styles.button, styles.inlineBtn)} onClick={handleDeleteDoc}>
                  <strong>🗑 </strong>&nbsp; Delete Doc
                </button>      &nbsp;&nbsp;&nbsp;           */}
          {/* <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={linkToDocs}>
            <strong>💾 </strong>&nbsp; View Docs
          </button>   */}
          <p></p><br/>
          
            <div><h5 className={styles.msg}>{msg}</h5></div>
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

// const fs = require('fs')

// export function getStaticProps() {
//   fs
//   return { props: { msg: 'hello world' } }
// }