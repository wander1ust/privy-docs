// import globalStyles from "../styles/globals.css";
import styles from "../styles/Login.module.css";
import Layout from "./Layout";
import { useSession } from "./Session";
import Image from 'next/image';

const Signin = ({ onSubmit, unlocked }) => {
    const session = useSession();
    return (
        <div className={styles.wrapper}>
            <img className={styles.bgCover} src='https://images.unsplash.com/photo-1503480207415-fdddcc21d5fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c2t5JTIwYmx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=700&q=60' />
            <div className={styles.inner}>
                {/* <Image className={styles.bgCover} src='/imgs/blue-sky.jpg' alt='blue sky background image' width={1000} height={500} /> */}
                
                <h2 className={styles.title}>Privy Docs</h2>
                    <button className={styles.loginBtn}
                        onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                        }}
                    >
                    <img className={styles.metaMaskIcon} alt='MetaMask icon logo' src='https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png' />
                    Sign in with MetaMask
                    </button>
                    <h5 className={styles.caption}><span style={unlocked ?  {} : {color: 'hotpink'}}>Your Privacy.</span> <span>{unlocked ? <span style={{color: 'hotpink'}}>Unlocked.</span> : 'Protected.'}</span></h5>
            </div>
    </div>
    )
}

export default Signin;