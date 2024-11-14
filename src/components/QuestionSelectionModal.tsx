import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "@/styles/Modal.module.css";
import { Question, Questions } from "@/types/questions";
import { prettify } from "@/utils/helpers";

type ModalProps = {
  containerId: string;
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedQuestions: Question[];
  setSelectedQuestions: (v: Question[]) => void;
};

type QuestionGridProps = {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
};

const QuestionGrid: React.FC<QuestionGridProps> = ({
  questions,
  onSelectQuestion,
}: QuestionGridProps) => {
  const [tooltip, setTooltip] = useState({
    show: false,
    text: "",
    timeoutId: null as any,
  });
  const tooltipRef = useRef<any>(null);

  const handleMouseOver = (question: Question) => {
    const timeoutId = setTimeout(() => {
      setTooltip({
        show: true,
        text: Questions[question].questionText,
        timeoutId: null,
      });
    }, 1500);

    setTooltip((prevState) => ({
      ...prevState,
      timeoutId,
    }));
  };

  const handleMouseOut = () => {
    if (tooltip.timeoutId) clearTimeout(tooltip.timeoutId);
    setTooltip({ show: false, text: "", timeoutId: null });
  };

  useEffect(() => {
    return () => {
      if (tooltip.timeoutId) clearTimeout(tooltip.timeoutId);
    };
  }, [tooltip.timeoutId]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {questions.map((question, index) => (
        <div
          key={index}
          onMouseOver={() => handleMouseOver(question)}
          onMouseOut={handleMouseOut}
          className="bg-white text-xs text-center p-4 rounded shadow cursor-pointer hover:bg-blue-200"
          onClick={() => onSelectQuestion(question)}
        >
          {prettify(question)}
        </div>
      ))}
      {tooltip.show && (
        <div ref={tooltipRef} className="absolute p-2 rounded shadow bg-white">
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

const Modal = ({
  containerId,
  show,
  onClose,
  onSubmit,
  selectedQuestions,
  setSelectedQuestions,
}: ModalProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestions([...selectedQuestions, question]);
  };

  const handleRemoveQuestion = (question: string) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
  };

  const content = show ? (
    <div className={styles.overlay}>
      {/* The modal should be larger for this since it's a more complex use case */}
      <div className="bg-white w-3/5 h-4/5 rounded-lg p-4 flex items-center justify-center">
        <div className="flex flex-col gap-4 h-full w-full">
          <div className="p-4 bg-blue-500 text-white text-center">
            <h2 className="font-bold text-xl">Choose questions</h2>
          </div>
          <div className="flex-grow p-4 bg-gray-200 overflow-auto">
            <QuestionGrid
              questions={
                Object.keys(Questions).filter(
                  (q: string) => !selectedQuestions.includes(q as Question)
                ) as Question[]
              }
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
          <div
            className="p-4 bg-gray-300 flex flex-wrap gap-2 overflow-auto"
            style={{ maxHeight: "200px" }}
          >
            {selectedQuestions.map((question, index) => (
              <div
                key={index}
                onClick={() => handleRemoveQuestion(question)}
                className="cursor-pointer text-xs text-center flex items-center gap-2 bg-white p-2 rounded shadow hover:bg-red-200"
              >
                <span>{prettify(question)}</span>
                {index < selectedQuestions.length - 1 && (
                  <span className="font-bold">→</span>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 flex justify-center">
            <button
              className="mx-2 bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => onSubmit()}
            >
              Taste!
            </button>
            <button
              className="mx-2 bg-red-500 text-white px-4 py-2 rounded"
              onClick={(e) => {
                e.preventDefault();
                setSelectedQuestions([]);
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    const modalContainer = document.getElementById(containerId);
    if (modalContainer) {
      return ReactDOM.createPortal(content, modalContainer);
    } else {
      throw new Error(`No #${containerId} element in which to mount the modal`);
    }
  } else {
    return null;
  }
};

export default Modal;
