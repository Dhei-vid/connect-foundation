"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Heart, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FeaturesSection() {
  const router = useRouter();
  return (
    <section className="py-30 2xl:py-40 px-4">
      {/* Background */}

      <div className="z-10 w-full lg:max-w-7xl mx-auto">
        {/* About US Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-0">
          {/* Images */}
          <div className="relative">
            <Image
              className={"rounded-[2rem] object-cover object-center h-full"}
              src={
                "https://images.pexels.com/photos/31095001/pexels-photo-31095001.jpeg"
              }
              alt={"image 1"}
              width={500}
              height={700}
            />

            <div className="top-[-20%] right-0 md:right-20 absolute bg-white rounded-[2rem] p-1">
              <Image
                className={
                  "rounded-[2rem] object-cover object-center w-32 h-32 lg:w-52 lg:h-52"
                }
                src={
                  "https://images.pexels.com/photos/9823013/pexels-photo-9823013.jpeg"
                }
                alt={"image 1"}
                width={500}
                height={600}
              />
            </div>

            <div className="absolute right-0 top-[80%] md:top-[50%] bg-white p-1 rounded-[2rem]">
              <div className="space-y-3 bg-main-red rounded-[2rem] px-4 py-4 lg:py-6 w-[15rem] lg:w-[20rem]">
                <p className="text-grey font-bold text-lg 2xl:text-3xl">
                  150 Grants Awarded Across 5 Countries
                </p>
                <Link
                  className="underline italic font-semibold text-main-blue/90 hover:text-main-blue/70"
                  href={"/about"}
                >
                  Become a donor
                </Link>
              </div>
            </div>
          </div>

          {/* About Us Text */}
          <div className="space-y-3">
            <div>
              <div className="flex flex-row items-center gap-1">
                <Heart size={18} className="text-main-red" />
                <p className={"font-semibold italic text-main-red"}>About Us</p>
              </div>
              <p className="font-bold text-2xl 2xl:text-5xl">
                Give Time, Change Lives Volunteer Opportunities
              </p>
            </div>

            <div>
              <p>
                Loads of text here about our mission, vision, and the impact we
                aim to create in the lives of children in need. Loads of text
                here about our mission, vision, and the impact we aim to create
                in the lives of children in need.
              </p>
            </div>

            <div className="space-y-6 lg:ml-15">
              <p>
                Loads of text here about our mission, vision, and the impact we
                aim to create in the lives of children in need. Loads of text
                here about our mission, vision, and the impact we aim to create
                in the lives of children in need.
              </p>
              <div>
                <div>
                  <div className="flex flex-row items-center gap-1">
                    <HeartHandshake size={20} className="text-main-red" />
                    <p className={"font-bold text-xl 2xl:text-2xl"}>
                      A legacy of Indigenous Environment
                    </p>
                  </div>
                  <p className={""}>
                    Supporting culture, healing, and education across
                    generations.
                  </p>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => router.push("/about-us")}
                  className="rounded-full bg-main-red"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
