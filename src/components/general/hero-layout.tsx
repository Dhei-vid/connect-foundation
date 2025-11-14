"use client";

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { heroLayoutStyle } from "@/common/style";

interface IHeroLayout {
  children: ReactNode;
  bgImage?: string;
}

const HeroLayout: FC<IHeroLayout> = ({ children, bgImage }) => {
  return (
    <div
      style={{ backgroundImage: `url(${bgImage ?? "/bg.jpg"})` }}
      className={cn(
        heroLayoutStyle,
        "relative bg-cover bg-no-repeat bg-center p-6 2xl:p-8 3xl:p-12 rounded-b-[3rem]"
      )}
    >
      {/* Gradient behind content */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-slate-800/50 to-gray-700/90 z-0 rounded-b-[3rem]"></div>

      {/* Content above gradient */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HeroLayout;
