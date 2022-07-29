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
        {/* <p>All of the docs that I have access to</p>
        <ul>
            {docs.map(doc => {
                return (
                <li key={doc._id}>{ doc.body }</li>
                )
            })}
        </ul> */}
      </div>
    )
}

// export async function getStaticProps() {
//     // const avatars = await fetch('https://last-airbender-api.herokuapp.com/api/v1/characters/avatar').then(res => res.json());
//     return {
//       props: {
//         docs
//       }
//     }
//   }