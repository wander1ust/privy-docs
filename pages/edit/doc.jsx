import { useState, useEffect, createContext, useContext } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import Layout from "../../components/Layout"
import { useSession, SignOutButton } from "../../components/Session"
import { EditorState } from 'draft-js';
import { connectToWallet, disconnectWallet, destroy, init } from '../metamask-login.jsx';

const SimpleEditor = dynamic(() => import( '../../components/Editor.jsx' ), { ssr: false } );

export default function Doc() {
    const router = useRouter();
    const session = useSession();
    const [address, setAddress] = useState(null);
    const [client, setClient] = useState(null);
    const [doc, setDoc] = useState('');
    const [docs, setDocs] = useState('');
    const [title, setTitle] = useState("Untitled");
    const [msg, setMsg] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty()); 
    const [rawContent, setRawContent] = useState(null); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const linktoHome = () => {
      router.push('/');
    }
  
  // Store note in Privy
  // const onShareDoc = async (e) => {
  //   await session.privy.addRequestersToRole(reader, [
  //     '',
  //   ]);
  // }
  
  // Store note in Privy
  const onSaveDoc = async (e) => {
      // const [text] = editorState.currentContent.blockMap;  // undefined
      if (!title) { alert(`Missing title`); }
      // if (!doc.toString()) { alert(`Missing doc`); }
      // if (!text) { alert(`Missing doc`); }
      try {
          const [htmlDocs] = await session.privy.put(session.address, [
            {
              field: 'docs', // json (arr of doc objects)
              value: JSON.stringify(generateDocsJson())
            }
          ])
          setMsg('Doc saved!');
          setDocs(htmlDocs?.text());
          console.log(htmlDocs?.text());
          setTimeout(linktoHome, 1000); 
        } catch(e) {
          console.log(e);
        }
  };

  const generateDocsJson = () => {
    let arr = [];
    let docToSave = {
      'id': 1,
      'title': title,
      'body': doc.toString(),
      'rawContent': rawContent
    };  
    let res = new Array(docToSave);
      if (!docs?.length == 0) {          
          const savedDocs = JSON.parse(docs);
          docToSave.id = savedDocs.length + 1
          res = [...savedDocs, docToSave];
    }
    return res;
  }

  // Temp
  const onDeleteDoc = async () => {
    alert('Coming soon! 👀');
}  
const onShareDoc = async () => {
    alert('Coming soon! 👀');
}

  useEffect(() => {
    if (!session.siwe.token || !session.address) {      
      router.push('/login');
    }
    setAddress(address);
    console.log(JSON.stringify(editorState));
}, []);

    async function getDocsFromPrivy() {
        try {
          const htmlDocs = await session.privy.get(
                  session.address,
                  "docs"
                );
                setDocs(htmlDocs?.text());        
              console.log('getDocsFromPrivy: ' + (htmlDocs !== null ? htmlDocs.text() : 'null'));      
        } catch (error) {
          console.log(error);
        }
    }

    useEffect(() => {
      getDocsFromPrivy();
    }, [session, docs]);

  return (
    <Layout>
    <div className={styles.container}>
        <SignOutButton className={'signOutBtn'} view={'editor'} />  
        <SimpleEditor style={{clear: 'both'}} doc={doc} setDoc={setDoc} docs={docs} title={title} setTitle={setTitle} editorState={editorState} setEditorState={setEditorState} setRawContent={setRawContent} />

      <footer className={styles.footer}>
          <button onClick={linktoHome}>🏠 Home</button>      &nbsp;&nbsp;&nbsp;  
          <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={onSaveDoc}>
                  <strong>💾 </strong>&nbsp; Save Doc
                </button>      &nbsp;&nbsp;&nbsp;
          <button className={Object.assign({}, styles.button, styles.inlineBtn)} onClick={onDeleteDoc}>
                  <strong>🗑 </strong>&nbsp; Delete Doc
                </button>      &nbsp;&nbsp;&nbsp;          
          <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={linktoHome}>
            <strong>📚 </strong> View Docs
          </button>      &nbsp;&nbsp;&nbsp;
          <button className={Object.assign({}, styles.button, styles.saveNote)} onClick={onShareDoc}>
            <strong>📲 </strong>&nbsp; Share
          </button>  
            <h5>{msg}</h5>
      </footer>
    </div>
    </Layout>
  )
}
