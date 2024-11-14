import styles from "@/styles/Home.module.css";

import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
import PageDetails from "@/components/PageDetails";

export default function Home() {
  return (
    <>
      <PageDetails />
      <Header />
      <main className={styles.main}>
        <div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
