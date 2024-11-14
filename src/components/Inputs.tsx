import { ReactNode, useState } from "react";
import { Attribute, N, TypicalWine } from "@/types/wine";
import styles from "@/styles/Wine.module.css";
import { TemplateWine } from "@/types/questions";
import { prettify } from "@/utils/helpers";

const classFromValue = (value?: N): string => {
  if (value == undefined || value == 0) {
    return styles.toggle0;
  } else if (value == -1) {
    return styles.toggleNeg1;
  } else if (value == 1) {
    return styles.toggle1;
  } else {
    return styles.toggle2;
  }
};

export const ToggleButton = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: N;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.toggle} ${classFromValue(value)}`}
    >
      {prettify(label)}
    </div>
  );
};

const Label = ({ value }: { value: string }) => {
  return <div className={styles.label}>{prettify(value)}</div>;
};

const deepCopy = <T,>(wine: T): T => {
  return JSON.parse(JSON.stringify(wine)) as T;
};

type WrapperProps = {
  children: ReactNode;
};

export const ToggleWrapper = ({ children }: WrapperProps) => {
  return <div className={styles.toggleWrapper}>{children}</div>;
};

export const GenericInput = ({
  question,
  wine,
  metaPressed,
  onClick,
}: {
  question: Attribute;
  wine: TypicalWine;
  metaPressed: boolean;
  onClick: (x: TypicalWine) => void;
}): JSX.Element => {
  const template = TemplateWine[question];
  const items = wine[question] || {};
  return (
    <>
      <Label value={prettify(question)} />
      <ToggleWrapper>
        {template &&
          items &&
          Object.keys(template).map((key) => {
            // @ts-ignore
            const value = items[key] || 0;
            return (
              <ToggleButton
                key={key}
                value={value}
                label={key}
                onClick={() => {
                  const newValueRaw = value + (metaPressed ? -1 : 1);
                  let newValue = newValueRaw;
                  if (newValueRaw == 3) {
                    newValue = -1;
                  } else if (newValueRaw == -2) {
                    newValue = 2;
                  }
                  if (question in wine) {
                    // @ts-ignore
                    wine[question][key] = newValue;
                  } else {
                    wine[question] = { [key]: newValue };
                  }
                  onClick(deepCopy(wine));
                }}
              />
            );
          })}
      </ToggleWrapper>
    </>
  );
};

// Color input is special because it's the only one that entirely negates
// the other option when one is chosen.
export const ColorInput = ({
  wine,
  setWine,
}: {
  wine: TypicalWine;
  setWine: (wine: TypicalWine) => void;
}): JSX.Element => {
  return (
    <>
      <Label value="Color" />
      <ToggleWrapper>
        <ToggleButton
          value={wine.colorType?.red || 0}
          label="Red"
          onClick={() => {
            if (
              wine.colorType?.white == 2 ||
              (wine.colorType?.red == 0 && wine.colorType.white == 0)
            ) {
              wine.colorType.red = 2;
              wine.colorType.white = -1;
              setWine(deepCopy(wine));
            }
          }}
        />
        <ToggleButton
          value={wine.colorType?.white || 0}
          label="White"
          onClick={() => {
            if (
              wine.colorType?.red == 2 ||
              (wine.colorType?.red == 0 && wine.colorType.white == 0)
            ) {
              wine.colorType.white = 2;
              wine.colorType.red = -1;
              setWine(deepCopy(wine));
            }
          }}
        />
      </ToggleWrapper>
    </>
  );
};

type EditableTextProps = {
  value: string;
  setValue: (newValue: string) => void;
  parenthesize?: boolean;
  prefix?: string;
};

export const EditableText = (props: EditableTextProps): JSX.Element => {
  const { value, setValue, parenthesize, prefix } = props;

  const [editing, setEditing] = useState(false);

  let displayValue = value;
  if (parenthesize) {
    displayValue = "(" + displayValue + ")";
  }

  if (prefix) {
    displayValue = prefix + displayValue;
  }

  let content: JSX.Element;
  if (editing) {
    content = (
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={() => setEditing(false)}
      />
    );
  } else {
    content = (
      <span onClick={() => setEditing(true)} className={styles.editableValue}>
        {displayValue}
      </span>
    );
  }

  return content;
};
