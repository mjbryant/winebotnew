import styles from "@/styles/Tasting.module.css";
import { BlindWine, Question } from "@/types/questions";
import { Tasting } from "@/types/tasting";
import { deepCopy } from "@/utils/helpers";
import { PENALTY, Scores } from "@/utils/scoring";

const getDisplayNameStrings = (name: string, subname?: string): string => {
  let displayName = name;
  if (subname) {
    displayName += ` (${subname})`;
  }
  return displayName;
};

const numTiedForFirst = (
  contenders: {
    score: number;
    name: string;
    subname?: string | undefined;
  }[]
): number => {
  const topScore = contenders[0].score;
  let numEqual = 1;
  for (const contender of contenders.slice(1)) {
    if (contender.score == topScore) {
      numEqual += 1;
    } else {
      break;
    }
  }
  return numEqual;
};

const formatAnswers = (
  questions: Question[],
  currentWine: BlindWine
): { [key: string]: any }[] => {
  return questions.map((q) => {
    return { [q]: currentWine[q] };
  });
};

const formatWines = (
  contenders: {
    score: number;
    name: string;
    subname?: string | undefined;
  }[]
): string => {
  return contenders
    .map((c) => {
      return `${getDisplayNameStrings(c.name, c.subname)}: ${c.score}`;
    })
    .join(", ");
};

const DebugPane = ({
  scores,
  tasting,
}: {
  scores: Scores | null;
  tasting: Tasting;
}): JSX.Element => {
  if (scores == null) {
    return <div className={styles.debugPane}>[]</div>;
  }
  const sortedWines = Object.values(scores)
    .filter((v) => v.score > PENALTY / 2)
    .sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      } else if (b.score > a.score) {
        return 1;
      } else {
        return 0;
      }
    });

  let contenderContent;
  const numInFirst = numTiedForFirst(sortedWines);
  if (numInFirst > 2) {
    contenderContent = `There are ${numInFirst} wines tied for first`;
  } else if (sortedWines.length > 1) {
    contenderContent = (
      <>
        Top two contenders:{" "}
        <b>
          {getDisplayNameStrings(sortedWines[0].name, sortedWines[0].subname)}
        </b>
        {" and "}
        <b>
          {getDisplayNameStrings(sortedWines[1].name, sortedWines[1].subname)}
        </b>
      </>
    );
  }

  return (
    <div className={styles.debugPane}>
      <div className={styles.debugSection}>{contenderContent}</div>
      <div className={styles.debugSection}>
        <b>All wines: </b>
        {formatWines(sortedWines)}
      </div>
      <div>
        <b>Questions answered: </b>
        {JSON.stringify(
          formatAnswers(tasting.questions, tasting.currentWine),
          null,
          2
        )}
      </div>
    </div>
  );
};

export default DebugPane;
