"use client";

import { Generations } from "@/components/data-guardians/Generations";
import { Statistics } from "@/components/data-guardians/Statistics";

export default function page() {
  return (
    <div className="flex flex-col ga-y-5">
      <div className="p-20">
        <Statistics />
        <Generations />
      </div>
    </div>
  );
}
