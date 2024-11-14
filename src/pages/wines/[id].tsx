import { useState } from "react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Router from "next/router";

import Header from "@/components/Header";
import PageDetails from "@/components/PageDetails";

import { useKeyPress } from "@/hooks/useKeyPress";

import homeStyles from "@/styles/Home.module.css";
import styles from "@/styles/Wine.module.css";
import sharedStyles from "@/styles/Shared.module.css";

import { Attribute, Color, TypicalWine } from "@/types/wine";
import { Questions } from "@/types/questions";
import { getDisplayName } from "@/utils/helpers";
import { getWine } from "@/utils/database";
import DeleteWineModal from "@/components/DeleteWineModal";
import { ColorInput, EditableText, GenericInput } from "@/components/Inputs";
import { SUBMIT_BUTTON } from "@/styles/shared";

type Data = {
  wine: TypicalWine;
};

const deepCopy = (wine: TypicalWine): TypicalWine => {
  return JSON.parse(JSON.stringify(wine)) as TypicalWine;
};

const getWineColor = (wine: TypicalWine): Color | null => {
  if (wine.colorType == undefined) {
    return null;
  } else if (wine.colorType.red == 2) {
    return "red";
  } else if (wine.colorType.white == 2) {
    return "white";
  } else {
    throw new Error(
      `Invalid colorType configuration on wine: ${wine.colorType}`
    );
  }
};

export default function WineDetail({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Does this need to be memoized?
  const parsedWine = deepCopy(data.wine);

  const [wine, setWineObject] = useState(parsedWine);
  const [modified, setModified] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const metaPressed = useKeyPress("Meta");

  const setWine = (wine: TypicalWine) => {
    setModified(true);
    setWineObject(wine);
  };

  const onSave = async () => {
    await fetch("/api/save-wine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wine }),
    });
    setModified(false);
  };

  const onDelete = async () => {
    await fetch("/api/delete-wine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: wine.id }),
    });
    Router.push("/wines");
  };

  return (
    <>
      <Header />
      <PageDetails />
      <div id="modal-root"></div>
      <DeleteWineModal
        show={showModal}
        containerId="modal-root"
        onClose={() => setShowModal(false)}
        onSubmit={onDelete}
      />
      <main className={homeStyles.main}>
        <div className={styles.table}>
          <div className={styles.wineHeader}>
            <div className={styles.displayName}>
              <EditableText
                value={wine.name}
                setValue={(v) => {
                  wine.name = v;
                  setWine(deepCopy(wine));
                  setModified(true);
                }}
              />
              {wine.subname ? (
                <EditableText
                  value={wine.subname}
                  setValue={(v) => {
                    wine.subname = v;
                    setWine(deepCopy(wine));
                    setModified(true);
                  }}
                  parenthesize={true}
                  prefix=" "
                />
              ) : (
                <></>
              )}
            </div>
            <div>
              <button
                disabled={!modified}
                onClick={onSave}
                className={modified ? SUBMIT_BUTTON : SUBMIT_BUTTON}
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(true)}
                className={sharedStyles.submitButton}
              >
                Delete
              </button>
            </div>
          </div>
          <div className={styles.divider}>{/* <hr /> */}</div>
          <ColorInput wine={wine} setWine={setWine} />
          {Object.entries(Questions).map((entry) => {
            const [question, questionTemplate] = entry;
            if (question === "colorType" || questionTemplate.unscored) {
              return null;
            }

            let typedQuestion = question as Attribute;
            if (
              !questionTemplate.appliesTo ||
              questionTemplate.appliesTo === getWineColor(wine)
            ) {
              // This also captures if appliesTo is undefined and the wine doesn't have
              // a color yet, which is fine.
              return (
                <GenericInput
                  key={typedQuestion}
                  question={typedQuestion}
                  wine={wine}
                  onClick={setWine}
                  metaPressed={metaPressed}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const id = context.query.id as string;
  const wine = await getWine(id);
  return {
    props: { data: { wine } },
  };
};
