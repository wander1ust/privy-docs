import { useState, useEffect, useRef, useContext, createContext } from 'react';

const HtmlParser = ({ htmlDoc }) => {
  const parse = require('html-react-parser');

    return (
      <>
       {parse('<p style="text-align:center;"><strong>yoo wassup</strong></p>')}
      </>
)}

export default HtmlParser;