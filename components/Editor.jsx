import { useState, useEffect, useRef, useContext, createContext } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import styles from '../styles/Editor.module.css'

const SimpleEditor = ({ doc, setDoc, docs, title, setTitle, editorState, setEditorState, setRawContent }) => {
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());    
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const docTitle = useRef(null);
    console.log(rawContentState);

    // Doc in HTML
    const docMarkup = draftToHtml(
      rawContentState, 
      true
    );

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        setDoc(docMarkup);
        // setTitle(docTitle.current.value);
        setRawContent(rawContentState);
    };

    const DocTitleContext = createContext();

    function useDocTitle() {
      return useContext('title');
    }    
    return (
        <>
       {/* <DocTitleContext.Provider value={title}> */}
            <form id={styles.docForm}>
            <input className={styles.docTitle} type='text' ref={docTitle} onChange={(e) => {setTitle(e.target.value)}} name="docTitle" /*placeholder='Untitled'*/ />
            </form>
      {/* </DocTitleContext.Provider> */} 
        <Editor 
            // toolbarOnFocus
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName={styles.editor}
            editorClassName="demo-editor"
            // defaultContentState={this.createFromText('text')} 
        />
        </>
    )
}

export default SimpleEditor;