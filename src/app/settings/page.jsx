"use client";
import RewardsForm from "@/components/dashboard/rewards/RewardsForm";

export default function page() {
  return (
    <div className="flex flex-col ga-y-5">
      <div className="flex flex-row justify-center items-center">
        <h1 className="text-2xl font-semibold leading-7 text-white">
          Rewards Information
        </h1>
      </div>
      <div className="p-20">
        <RewardsForm />
      </div>
    </div>
  );
}
