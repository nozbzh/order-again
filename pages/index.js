import Head from "next/head";
import styles from "./index.module.css";
import NoteList from "../components/NoteList";

const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>Notes</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <h1 className={styles.title}>Note App</h1>

      <NoteList notes={[{ title: "hi", body: "yes" }]} />
    </main>
  </div>
);

export default Home;
