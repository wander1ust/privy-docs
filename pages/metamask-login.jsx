// import { PrivyClient, SiweSession } from "@privy-io/privy-browser";
import { useRouter } from "next/router";

export const init = async (PrivyClient, SiweSession, setSession) => {
    const provider = typeof window !== "undefined" ? window.ethereum : null;
    const session = new SiweSession(
      process.env.NEXT_PUBLIC_PRIVY_API_KEY,
      provider
    );
    const client = new PrivyClient({
      session: session,
    });
    setSession(await session);
}

    // Connect to a MetaMask wallet
   export const connectToWallet = async (session, setAddress) => {
        try {
        const { ethereum } = window;
  
        if (!ethereum) {
            alert("Please install MetaMask for this demo: https://metamask.io/");
            return;
        }
  
        if (!(await session.isAuthenticated())) {
            await session.authenticate();
        }
        const address = await session.address();
        setAddress(await address);
        console.log(`Address: ${address}`);
        } catch (error) {
        console.error(error);
        }
    };

    // Destroys the session
    export const destroy = async (setAddressFunc) => {
        await session.destroy();
        setAddressFunc(null);
    }
    
    export function disconnectWallet(session, setAddress, useSession, destroy) {
        // const router = useRouter();
        // const session = () => {useSession()};
        if (!session) return;
        session.destroy(setAddress).then(() => {
            console.log('Logged out');
        })
        // return (
        //   <div>
        //     <a
        //       href="/sign-out"
        //       onClick={(e) => {
        //         e.preventDefault();
        //         session.destroy(setAddressFunc).then(() => router.push("/sign-in"));
        //       }}
        //     >
        //       Sign out
        //     </a>
        //   </div>
        // );
      }

    //   export function Logout(session) {
    //     const router = useRouter();
    //     const session = useSession();
      
    //     return (
    //       <div>
    //         <a
    //           href="/log-out"
    //           onClick={(e) => {
    //             e.preventDefault();
    //             session.destroy().then(() => router.push("/log-in"));
    //             // router.push("/log-in");
    //           }}
    //         >
    //           Sign out
    //         </a>
    //       </div>
    //     );
    //   }