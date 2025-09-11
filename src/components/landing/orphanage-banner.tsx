"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { headerStyle } from "@/common/style";
import { cn } from "@/lib/utils";

const OrphanageBanner = () => {
  const router = useRouter();

  return (
    <div className={"rounded-lg bg-main-blue p-8 2xl:py-12 text-center my-12"}>
      <div className="flex flex-col items-center justify-center space-y-5">
        <h2 className={cn(headerStyle, "text-white")}>
          Join Our Support Network
        </h2>
        <p className={"text-white w-full md:w-[80%] lg:w-[60%]"}>
          Are you an orphanage seeking assistance or resources? Register today
          and become part of our growing community of care.
        </p>
        <Button
          size={"lg"}
          onClick={() => router.push("/orphanage/signup")}
          className={"bg-main-red/70 hover:bg-main-red/50"}
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default OrphanageBanner;
