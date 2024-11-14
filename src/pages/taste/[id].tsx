import React, { useEffect, useState } from "react";

import homeStyles from "@/styles/Home.module.css";
import styles from "@/styles/Tasting.module.css";
import sharedStyles from "@/styles/Shared.module.css";

import PageDetails from "@/components/PageDetails";
import Header from "@/components/Header";
import { Tasting } from "@/types/tasting";
import { ToggleButton } from "@/components/Inputs";
import { deepCopy, prettify } from "@/utils/helpers";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import DebugPane from "@/components/DebugPane";
import { Scores } from "@/utils/scoring";
import {
  BlindWine,
  InputType,
  Question,
  Questions,
  TemplateWine,
} from "@/types/questions";
import { N } from "@/types/wine";
import { getInitialSubmitText, numSelected } from "@/utils/questionHelpers";

const Input = ({
  currentWine,
  setCurrentWine,
  question,
  setError,
  setSubmitText,
}: {
  currentWine: BlindWine;
  setCurrentWine: (c: BlindWine) => void;
  question: Question;
  setError: (e: string) => void;
  setSubmitText: (v: string) => void;
}): JSX.Element => {
  const questionTemplate = Questions[question];
  const inputType = questionTemplate.inputType;
  const template = TemplateWine[question];
  if (!template) {
    throw new Error("TemplateWine must have all attributes defined");
  }

  let inputContent;
  if (inputType == InputType.OneOf || inputType == InputType.Multiple) {
    inputContent = (
      <>
        {Object.keys(template).map((key) => {
          let attribute = currentWine[question] || {};
          const value = attribute[key as keyof typeof attribute] || 0;
          return (
            <ToggleButton
              key={key}
              value={value as N}
              label={key}
              onClick={() => {
                // OneOf inputs automatically un-select the other options,
                // and clicking on the selected option does nothing
                if (inputType == InputType.OneOf) {
                  // @ts-ignore
                  attribute = new Map(
                    Object.keys(template).map((k) => [k, -1])
                  );
                  // @ts-ignore
                  attribute[key] = 2;
                }
                // Multiple inputs don't automatically un-select the other options,
                // and clicking on one of the selected options un-selects it. Also
                // if N > maxAllowed are already selected it shows an error
                else {
                  if (value == 2) {
                    // @ts-ignore
                    attribute[key] = 0;
                    setError("");
                  } else {
                    if (
                      questionTemplate.maxAllowed &&
                      numSelected(attribute) >= questionTemplate.maxAllowed
                    ) {
                      setError(
                        `Only ${questionTemplate.maxAllowed} selections allowed. Please unselect an existing answer first.`
                      );
                    } else {
                      // @ts-ignore
                      attribute[key] = 2;
                      setError("");
                    }
                  }
                }
                currentWine[question] = attribute;
                setCurrentWine(deepCopy(currentWine));
                setSubmitText("Submit");
              }}
            />
          );
        })}
      </>
    );
  } else {
    // This relies on Javascript's guarantee (since ES2015) that string keys are ordered
    // in ascending insertion order. The TemplateWine always has the lowest value first
    // and the highest value last. We can codify this in a test, I guess.
    const labels = Object.keys(template);
    // T options + the ones in between, minus 1 for zero-indexing
    const max = labels.length + (labels.length - 1) - 1;
    const lowLabel = prettify(labels[0]);
    const highLabel = prettify(labels[labels.length - 1]);

    const attribute = currentWine[question] || {};
    const attributeToValue = questionTemplate.attributeToValue;
    const valueToAttribute = questionTemplate.valueToAttribute;
    if (!attributeToValue || !valueToAttribute) {
      throw new Error(
        "Must define attributeToValue and valueToAttribute on slider inputs"
      );
    }
    const value = attributeToValue(attribute);
    inputContent = (
      <>
        <div className={styles.sliderLabel}>{lowLabel}</div>
        <input
          min={0}
          max={max}
          type="range"
          value={`${value}`}
          onChange={(e) => {
            // @ts-ignore - typescript's never going to like these shenanigans
            currentWine[question] = valueToAttribute(e.target.value);
            setCurrentWine(deepCopy(currentWine));
          }}
        />
        <div className={styles.sliderLabel}>{highLabel}</div>
      </>
    );
  }
  return (
    <>
      <div className={styles.questionLabel}>
        {questionTemplate.questionText}
      </div>
      <div className={styles.center}>{inputContent}</div>
    </>
  );
};

export default function Taste({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { id: tastingId } = data;

  const [loading, setLoading] = useState(true);

  // Having these nested like this is making everything not work properly. I don't understand
  // some key aspects of React and it shows.
  const [tasting, setTasting] = useState<Tasting | null>(null);
  const [currentWine, setCurrentWine] = useState<BlindWine | null>(null);
  const [submitText, setSubmitText] = useState<string | null>(null);

  const [showDebug, setShowDebug] = useState(false);
  const [scores, setScores] = useState<Scores | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The initial load of the tasting object
  useEffect(() => {
    const getTastingApi = async () => {
      const response = await fetch(`/api/tastings/${tastingId}`);
      const result = await response.json();
      setLoading(false);
      setTasting(result.tasting);
      setCurrentWine(result.tasting.currentWine);
      setSubmitText(getInitialSubmitText(result.tasting.questions[0]));
    };

    getTastingApi();
  }, [tastingId]);

  const onSubmit = async () => {
    if (!tasting) {
      throw new Error(
        "Should have already fetched the tasting object on submit"
      );
    }
    console.log(`Tasting: ${JSON.stringify(tasting)}`);
    const response = await fetch("/api/answer-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasting, currentWine }),
    });
    const result = await response.json();

    setError(null);
    setTasting(result.tasting);
    setCurrentWine(result.tasting.currentWine);
    setSubmitText(getInitialSubmitText(result.tasting.questions[0]));
    setScores(result.scores);
    // This is a bit of a kludge, relying on the presence of topCandidates as a signal that we're done
    if (result.tasting.topCandidates) {
      setDone(true);
    }
  };

  if (loading || !tasting || !currentWine) {
    // This should be a loading state eventually but loading states are hard for some reason
    return <></>;
  } else {
    return (
      <>
        <style jsx global>
          {`
            body {
              overflow: hidden;
            }
          `}
        </style>
        <PageDetails />
        <Header />
        <main className={homeStyles.main}>
          {done ? (
            <div>
              {`You're done. The best contender is: ${tasting.topCandidates?.at(
                0
              )}`}
            </div>
          ) : (
            <div className={styles.bodyContainer}>
              <div className={styles.questionContainer}>
                <Input
                  currentWine={currentWine}
                  setCurrentWine={setCurrentWine}
                  question={tasting.questions[0]}
                  setError={setError}
                  setSubmitText={setSubmitText}
                />
                <div className={styles.errorContainer}>{error}</div>
                <div className={styles.submitContainer}>
                  <button
                    className={
                      loading || !tasting || !submitText
                        ? "bg-blue-500 text-white font-bold py-1 px-2 rounded-lg cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg"
                    }
                    onClick={onSubmit}
                    type="submit"
                    disabled={loading || !tasting || !submitText}
                  >
                    {submitText ? submitText : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showDebug && <DebugPane scores={scores} tasting={tasting} />}
          <div className={styles.showDebug}>
            <label className={styles.showDebugLabel} htmlFor="show-debug">
              Show debug
            </label>
            <input
              id="show-debug"
              type="checkbox"
              checked={showDebug}
              onChange={() => setShowDebug((prev) => !prev)}
            />
          </div>
        </main>
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps<{
  data: { id: string };
}> = async (context) => {
  const id = context.query.id as string;
  return {
    props: { data: { id } },
  };
};
