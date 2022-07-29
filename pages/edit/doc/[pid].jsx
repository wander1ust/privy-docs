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

export default function Doc1({ docs }) {
    const router = useRouter();
    const { pid, token, myDocs } = router.query;
    const session = useSession();
    const parse = require('html-react-parser');

    const authenticate = async () => {
        const response = await axios.post<{token}>('/api/privy/tokens');
        return response.data.token;
    };
    
    const client = new PrivyClient({
        session: new CustomSession(authenticate),
    });    

    const sampleMarkup =
    '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
    '<a href="http://www.facebook.com">Example link</a>';

    const linktoHome = () => {
        router.push('/');
    }    

    useEffect(() => {
        console.log(typeof (myDocs));
        console.log(myDocs);
    }, []);
    
    return (
        <>
            <button onClick={linktoHome}>Home</button>
            {/* ToDo: Replace with doc title */}
            <h1 style={{textAlign: 'center'}}>Doc {pid}</h1>            
            {typeof(myDocs) == 'string' ? parse(JSON.parse(myDocs)) : myDocs}
        </>
    )
}