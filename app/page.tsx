import React from "react";
import { FlipWords } from "@/components/ui/flip-words";

function FlipWordsDemo() {
  const words = ["better", "crazy", "dangerous", "anything"];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
        Break
        <FlipWords words={words} /> <br />
        With CtfBattle
      </div>
    </div>
  );
}

export default FlipWordsDemo; // Default export
