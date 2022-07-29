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
    const [view, setView] = useState(null);
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

              console.log('getDocsFromPrivy: ' + (htmlDocs !== null ? htmlDocs.text() : 'null'));
              localStorage.setItem('docs', htmlDocs);
              console.log(`Local storage docs: ${localStorage.getItem(docs)}`);
        } catch (error) {
          console.log(error);
        }
    }

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


  const showDocs = () => {
    if (!docs) return;
    // ToDo: Check if docs is JSON
    // if (!Array.isArray(docs)) return;
    return JSON.parse(docs).map((doc , i)=> {
      return (
            <>
                <a href={`edit/doc/${i+1}?myDocs=${JSON.stringify(JSON.parse(docs)[i].body)}`} className={styles.card} target='_blank'>
                {/* <a href={`edit/doc/${i+1}?myDocs=${docs}`} className={styles.card} target='_blank'> */}
              <h2>{doc.title.toLowerCase() !== 'untitled' ? doc.title : `Doc ${i+1}`} </h2>
             
                {doc.body}

                </a>
                <a className={styles.deleteDoc} onClick={(e) => {onDeleteDoc(e, {i})}}><span className={styles.deleteIcon}>🗑</span></a>
                </>
    )
  }) }  

  return (
    <Layout>
       <div className={styles.container}>      
       <div className={styles.grid}>
        {showDocs()}
       </div>

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
          <p></p><br/>

            <div><h5 className={styles.msg}>{msg}</h5></div>
      </footer>
    </div>
    </Layout>
  )
}