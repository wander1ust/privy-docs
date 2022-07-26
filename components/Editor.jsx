import { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const SimpleEditor = ({ note, setNote, editorState, setEditorState }) => {
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());    
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        setNote(noteMarkup);
    };
    // Note in HTML
    const noteMarkup = draftToHtml(
        rawContentState, 
        // hashtagConfig, 
        true
        // customEntityTransform
      );
    //   console.log(noteMarkup);
    return (
        <>
        <Editor 
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            // defaultContentState={this.createFromText('text')} 
        />
        </>
    )
}

export default SimpleEditor;