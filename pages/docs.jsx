import { useRouter } from "next/router";
import { useState, useEffect, useContext } from 'react';

export default function Docs({ docs }) {
    // ToDo: Refactor code - move to Layout
    const router = useRouter();
    const linktoHome = () => {
        router.push('/');
      }
    return (
      <div>
        <h1>My Docs</h1>
        <button onClick={linktoHome}>Home</button>
      </div>
    )
}