import React from "react";

import Router from "next/router";
import styles from "@/styles/Home.module.css";
import PageDetails from "@/components/PageDetails";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <PageDetails />
      <Header />
      <main className={styles.main}>
        <div className={styles.thing}>
          <div className={styles.item} onClick={() => Router.push("/home")}>
            JK there are no settings
          </div>
        </div>
      </main>
    </>
  );
}
