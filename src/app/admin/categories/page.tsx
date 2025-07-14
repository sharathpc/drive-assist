"use client";

import { useState } from "react";

import { Loader } from "@/components/ui/loader";
import { QUESTIONS_DATA } from "@/questions";
import { QuestionItem } from "@/components/admin/question-item";

export default function CategoriesPage() {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex justify-between items-center bg-background sticky top-0 px-2 mb-4">
        <div className="text-xl font-bold">Categories</div>
      </div>
      {loading ?
        <Loader
          className="h-80"
          width={2}
          height={2}
          fullScreen={false}
        /> :
        <div className="flex w-full">
          <div className="hs-accordion-treeview-root">
            {QUESTIONS_DATA.map((item, index) =>
              <QuestionItem key={index} question={item} />
            )}
          </div>
        </div>}
    </div>
  );
}