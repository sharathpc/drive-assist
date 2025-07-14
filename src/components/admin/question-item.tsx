import { useState } from "react";

import { cn } from "@/lib/utils";
import { Question } from "@/models";

interface QuestionItemProps {
  question: Question;
}

export const QuestionItem = ({ question }: QuestionItemProps) => {
  const [active, setActive] = useState<boolean>();

  return (
    <div className="hs-accordion-group ps-7">
      <div className={cn(
        "hs-accordion",
        { ["active"]: active }
      )}>
        <div className="hs-accordion-heading py-0.5 flex items-center gap-x-0.5 w-full">
          {question.questions?.length &&
            <button
              className="hs-accordion-toggle size-6 flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-controls="hs-basic-tree-collapse-one"
              onClick={() => setActive(!active)}
            >
              <svg className="hs-accordion-active:rotate-90 transition duration-300 size-2.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path>
              </svg>
            </button>}

          <div className="grow hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-1.5 rounded-md cursor-pointer">
            <div className="flex items-center gap-x-3">
              {question.questions?.length ?
                <svg className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                </svg> :
                <svg className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                </svg>
              }
              <div className="grow">
                <span className="text-sm text-gray-800 dark:text-neutral-200">
                  {question.content}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-tree-heading-one">
          {question.questions?.length &&
            question.questions.map((item, index)=>
              <QuestionItem key={index} question={item} />
            )}
        </div>
      </div>
    </div>
  );
}