import React, { useState } from "react";
import { useSession } from "../components/Session";
import { useRouter } from "next/router";
// import Layout from "../components/Layout";
import Login from "../components/Login";

export async function getStaticProps() {
  return {
    props: {
      protected: false,
    },
  };
}

function SignIn() {
  const router = useRouter();
  const session = useSession();
  const [address, setAddress] = useState(null);

   function onSubmit() {
    async function onSuccess() {
      // console.log(session._address);
      setAddress(session._address);
      console.log(session._address);
      router.push("/");
    }

    function onFailure(error: Error) {
      console.error(error);
    }

    session.authenticate().then(onSuccess, onFailure);
  }

  return (
    <>
    {/* <h2 style={{display: 'absolute'}}>Privy Docs</h2> */}
    <Login onSubmit={onSubmit} />
    </>
  );
}

export default SignIn;
