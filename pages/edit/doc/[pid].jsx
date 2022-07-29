import { useRouter } from "next/router";
import { useState, useEffect, useContext } from 'react';
import { useSession } from "../../../components/Session";
import { HtmlParser } from "../../../components/HtmlParser";

import axios from 'axios';
import { PrivyClient, CustomSession } from '@privy-io/privy-browser';

import { EditorState, ContentState } from 'draft-js';
import dynamic from 'next/dynamic'
// import htmlToDraft from 'html-to-draftjs';

const SimpleEditor = dynamic(() => import( '../../../components/Editor.jsx' ), { ssr: false } );
const htmlToDraft = dynamic(() => import('html-to-draftjs'), { ssr: false })

// let htmlToDraft = null;
// if (typeof window === 'object') {
//   htmlToDraft = require('html-to-draftjs').default;
// }

export default function Doc1({ docs }) {
    const router = useRouter();
    const { pid, token, myDocs } = router.query;
    // const { title, rawContent } = JSON.parse(htmlDoc);

    // console.log(title);

    const session = useSession();
    const parse = require('html-react-parser');

    // This can be any async function that returns a valid Privy access token
    const authenticate = async () => {
        const response = await axios.post<{token}>('/api/privy/tokens');
        return response.data.token;
    };
    
    const client = new PrivyClient({
        session: new CustomSession(authenticate),
    });    

    // const blocksFromHtml = htmlToDraft(htmlDoc);
    // const { contentBlocks, entityMap } = blocksFromHtml;
    // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    // const editorState = EditorState.createWithContent(contentState);

    // const htmlToDraftBlocks = (html) => {
    //     const blocksFromHtml = htmlToDraft(htmlDoc);
    //     const { contentBlocks, entityMap } = blocksFromHtml;
    //     const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    //     const editorState = EditorState.createWithContent(contentState);
    //     return editorState;
    //    }
    //    useEffect(()=>{
    //    setEditorState(htmlToDraftBlocks("<p>Hello</p>"));
    //    },[])

    const sampleMarkup =
    '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
    '<a href="http://www.facebook.com">Example link</a>';

//     const {
//         convertFromHTML,
//         ContentState
//       } = require('draft-js');
//     //   const htmlToDraft = require('html-to-draftjs');
  
//   const blocksFromHTML = convertFromHTML(sampleMarkup);
//   const state = ContentState.createFromBlockArray(
//     blocksFromHTML.contentBlocks,
//     blocksFromHTML.entityMap,
//   );
  
//   this.state = {
//     editorState: EditorState.createWithContent(state),
//   };    

    // const contentBlock = htmlToDraft(htmlDoc);
    // function htmlToContentState(html) {
    //     if (html === "") {
    //       return ContentState.createFromText("")
    //     }
    //     else {
    //       return ContentState.createFromBlockArray(
    //         htmlToDraft(html).contentBlocks
    //       )
    //     }
    //   }
    // const contentBlock = htmlToContentState('<p>hi</p>');
    // console.log(htmlToDraftBlocks('<p>hi</p>'));

    // const docContent = htmlToDraft(htmlDoc, (nodeName, node) => {
    //     if (nodeName === 'hr') {
    //       return {
    //         type: 'HORIZONTAL_RULE',
    //         mutability: 'MUTABLE',
    //         data: {}
    //       };
    //     }
    //   })

    const linktoHome = () => {
        router.push('/');
    }    

    // const onDeleteDoc = async (e) => {
    //         try {
    //             const [htmlDocs] = await session.privy.put(session.address, [
    //               {
    //                 field: 'docs', // json (arr of doc objects)
    //                 value: JSON.stringify(generateDocsJson())
    //               }
    //             ])
    //             setMsg('Doc deleted!');

    //             setDocs(htmlDocs?.text());
    //             console.log(htmlDocs?.text());      
    //           } catch(e) {
    //             console.log(e);
    //           }
    //     };        
    // }

    useEffect(() => {
        // if (!session.siwe.token || !session.address) {      
        //   router.push('/login');
        // }
        console.log(typeof (myDocs)); // string
        console.log(myDocs); // string
        // console.log(JSON.parse(htmlDoc)).rawContent); 
        // console.log(doc);

    }, []);
    

    return (
        <>
            <button onClick={linktoHome}>Home</button>
            {/* ToDo: Replace with doc title */}
            <h1 style={{textAlign: 'center'}}>Doc {pid}</h1>            
            {typeof(myDocs) == 'string' ? parse(JSON.parse(myDocs)) : myDocs}
            {/* {console.log(typeof(JSON.parse(myDocs).body))} */}
            {/* {parse(JSON.stringify(JSON.parse(myDocs).body)) */}
            {/* {parse(JSON.parse(myDocs).body)} */}
            {/* {parse('<p style="text-align:center;"><strong>yoo wassup</strong></p>')}} */}
            {/* {parse('<p>Hello, World!</p>')} */}
            {/* <button onClick={onDeleteDoc}>
                  <strong>🗑 </strong> Delete Doc
            </button>  */}
            {/* <HtmlParser htmlDoc={'<p>hi</p>'} /> */}
        </>
    )
}

// export async function getStaticProps() {
//     // Call an external API endpoint to get posts.
//     // You can use any data fetching library
//     // const res = await fetch('https://.../posts')
//     // const posts = await res.json()
  
//     // By returning { props: { posts } }, the Blog component
//     // will receive `posts` as a prop at build time
//     return {
//       props: {
//         docs,
//       },
//     }
//   }