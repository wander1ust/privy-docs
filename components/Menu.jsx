import styles from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { useSession, SignOutButton } from "../components/Session";

const Menu = ({ docs, setDocs, setMsg }) => {
    const router = useRouter();
    const session = useSession();
    
    /* Event handlers */
    const onCreateDoc = async(e) => {
        linktoEditor();
    }

    // Data is encrypted
    const onViewShared = async(e) => {
        // Get docs from sharer. Use privy-node with Node.js instead.
        const sharedDocs = await session.privy.get('0xe5Af738efD11737EC3e6cF7Dc9237f538402bd6d', 'docs');
        console.log(JSON.stringify(docs));
        // Save docs to user account
        const copySharedDocs = await session.privy.put(session.address, 'docs', docs);
        console.log(copySharedDocs);
    }    

    const linktoEditor = () => {
        router.push('/edit/doc');
    }
  
    return(
        <>
        <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={onDeleteDocs}>
        <strong>📗 </strong> Delete Docs
        </button>      &nbsp;&nbsp;&nbsp;     
        <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={linktoEditor}>
        <strong>📗 </strong> Go to Editor
        </button>      &nbsp;&nbsp;&nbsp;        

        <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={onCreateDoc}>
        <strong>➕ </strong> New Doc
        </button>      &nbsp;&nbsp;&nbsp;                 
        <button className={Object.assign({}, styles.button, styles.menuBtn, styles.saveNote)} onClick={onViewShared}>
        <strong>➕ </strong> Shared with Me
        </button>      &nbsp;&nbsp;&nbsp;
        </>
    )
}
export const onDeleteDocs = async(e) => {
    // ToDo: trigger dialog; warn user that permanent deletion cannot be undone
    await session.privy.del(session.address, 'docs');
    // ToDo: replace with Link to refresh homepage
    router.push('/'); 
    setMsg('Docs successfully deleted!')
}

export default Menu;