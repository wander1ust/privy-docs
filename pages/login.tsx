import React, { useState } from "react";
import { useSession } from "../components/Session";
import { useRouter } from "next/router";
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
  const [unlocked, setUnlocked] = useState(false);
  const [address, setAddress] = useState(null);

   function onSubmit() {
    async function onSuccess() {
      // ToDo: Change text effect
      setUnlocked(true);
      setTimeout(() => {
        router.push("/");
    }, 3000);
    }

    function onFailure(error: Error) {
      console.error(error);
    }

    session.authenticate().then(onSuccess, onFailure);
  }

  return (
    <>
      <Login onSubmit={onSubmit} unlocked={unlocked} />
    </>
  );
}

export default SignIn;
