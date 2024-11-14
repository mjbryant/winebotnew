import { useState } from "react";

import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Router from "next/router";

import homeStyles from "@/styles/Home.module.css";
import styles from "@/styles/Wines.module.css";
import sharedStyles from "@/styles/Shared.module.css";

import { getWines } from "@/utils/database";
import { TypicalWine } from "@/types/wine";
import PageDetails from "@/components/PageDetails";
import Header from "@/components/Header";
import Modal from "@/components/NewWineModal";
import { getColor, getDisplayName } from "@/utils/helpers";

type Data = {
  wines: TypicalWine[];
};

const Row = ({ wine }: { wine: TypicalWine }) => {
  return (
    <div
      onClick={() => {
        Router.push(`/wines/${wine.id}`);
      }}
      className={styles.wine}
    >
      {getDisplayName(wine.name, wine.subname)}
    </div>
  );
};

export default function Wines({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showModal, setShowModal] = useState(false);
  const [showWhite, setShowWhite] = useState(true);
  const [showRed, setShowRed] = useState(true);

  const { wines } = data;
  const addWine = () => setShowModal(true);

  return (
    <>
      <PageDetails />
      <Header />
      <div id="modal-root"></div>
      <Modal
        show={showModal}
        containerId="modal-root"
        onClose={() => setShowModal(false)}
        onSubmit={async (name, subname) => {
          const result = await fetch("/api/new-wine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, subname }),
          });
          const { id: newWineId } = await result.json();
          Router.push(`/wines/${newWineId}`);
        }}
      />
      <main className={homeStyles.main}>
        <div className={styles.table}>
          <div className={styles.header}>
            <div className={styles.displayName}>Varietal</div>
            {/* This should be a generic filters component! */}
            <div className={styles.buttonGroup}>
              <form className={styles.wineTypeSelect}>
                <span className={styles.checkbox}>
                  <label htmlFor="red">Red</label>
                  <input
                    id="red"
                    type="checkbox"
                    checked={showRed}
                    onChange={() => setShowRed(!showRed)}
                  ></input>
                </span>
                <span className={styles.checkbox}>
                  <label htmlFor="white">White</label>
                  <input
                    id="white"
                    type="checkbox"
                    checked={showWhite}
                    onChange={() => setShowWhite(!showWhite)}
                  ></input>
                </span>
              </form>
              <button className={sharedStyles.submitButton} onClick={addWine}>
                Add wine
              </button>
            </div>
          </div>
          <div className={styles.divider}>
            <hr />
          </div>
          {wines
            .sort((a, b) => {
              const dA = getDisplayName(a.name, a.subname);
              const dB = getDisplayName(b.name, b.subname);
              if (dA === dB) {
                return 0;
              } else if (dA < dB) {
                return -1;
              } else {
                return 1;
              }
            })
            .filter((wine) => {
              return (
                (showRed && getColor(wine) === "red") ||
                (showWhite && getColor(wine) === "white")
              );
            })
            .map((wine) => (
              <Row key={`${wine.name} (${wine.subname})`} wine={wine} />
            ))}
        </div>
        <div id="new-wine-modal"></div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const wines = await getWines();
  return {
    props: { data: { wines } },
  };
};
