import React, { useState } from "react";

import Router from "next/router";
import styles from "@/styles/Home.module.css";
import PageDetails from "@/components/PageDetails";
import Header from "@/components/Header";
import { Question } from "@/types/questions";
import QuestionSelectionModal from "@/components/QuestionSelectionModal";

export default function Home() {
  const [chooseQuestions, setChooseQuestions] = useState(false);
  const [questionOrderOverride, setQuestionOrderOverride] = useState<
    Question[]
  >([]);
  const [showModal, setShowModal] = useState(false);

  const initiateTastingSession = async () => {
    const result = await fetch("/api/create-tasting-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionOrderOverride }),
    });
    const { id: tastingSessionId } = await result.json();
    Router.push(`/taste/${tastingSessionId}`);
  };

  const onTaste = async () => {
    if (chooseQuestions) {
      setShowModal(true);
    } else {
      initiateTastingSession();
    }
  };

  return (
    <>
      <PageDetails />
      <Header />
      <div id="modal-root"></div>
      <QuestionSelectionModal
        containerId="modal-root"
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async () => {
          await initiateTastingSession();
        }}
        selectedQuestions={questionOrderOverride}
        setSelectedQuestions={setQuestionOrderOverride}
      />
      <main className={styles.main}>
        <div className={styles.bodyContainer}>
          <div className={styles.buttons}>
            <div onClick={() => Router.push("/wines")} className={styles.item}>
              View wines
            </div>
            <div onClick={onTaste} className={styles.item}>
              Blind taste
            </div>
          </div>
        </div>
        <div className={styles.showDebug}>
          <label className={styles.debugLabel} htmlFor="choose-questions">
            Choose questions
          </label>
          <input
            id="choose-questions"
            type="checkbox"
            checked={chooseQuestions}
            onChange={() => setChooseQuestions((prev) => !prev)}
          />
        </div>
      </main>
    </>
  );
}
