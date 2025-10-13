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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-4">
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

            <div className="top-[-20%] right-0 md:right-10 lg:right-20 absolute bg-white rounded-[2rem] p-1">
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

            <div className="absolute right-0 top-[80%] lg:top-[50%] bg-white p-1 rounded-[2rem]">
              <div className="space-y-3 bg-main-red rounded-[2rem] px-4 py-4 lg:py-6 w-[15rem] lg:w-[20rem]">
                <p className="text-grey font-bold text-lg 2xl:text-3xl">
                  150 Grants Awarded Across 5 Countries
                </p>
                <Link
                  className="underline italic font-semibold text-main-blue/90 hover:text-main-blue/70"
                  href={"/donate"}
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
              <p className="font-bold text-2xl 2xl:text-5xl">Connect</p>
            </div>

            <div>
              <p>
                Connect Orphanage Foundation (COF) was founded out of deep
                personal conviction that no child should be left behind simply
                because they lost their parents. In many parts of our community
                and beyond, orphans face silent struggles, lack of food,
                shelter, education, emotional support and most importantly the
                feeling of being forgotten.
              </p>
            </div>

            <div className="space-y-6 m-0 lg:ml-10 xl:ml-10">
              <p>
                As an organization who has always believed in compassion,
                service and meaningful impact, we found ourselves drawn to the
                needs of orphaned children. The more we visited orphanages and
                listened to their stories the more we realized how much could be
                done if we were simply willing to connect hearts to the
                children, resources to the need, and communities to
                responsibilities.
              </p>
              <div>
                <div className="space-y-3">
                  {/* <div className="flex flex-row items-center gap-1">
                    <HeartHandshake size={20} className="text-main-red" />
                    <p className={"font-bold text-xl 2xl:text-2xl"}>
                      A legacy of Indigenous Environment
                    </p>
                  </div> */}
                  <p className={""}>
                    We exist not just to give handouts, but to build long
                    lasting relationships with orphanages, caretakers and the
                    children themselves. We aim to address their needs
                    holistically supporting their physical wellbeing, emotional
                    healing, spiritual growth, and educational advancement.
                  </p>
                  <p className={""}>
                    This foundation is a response to real need, it is also a
                    call to communities, and partners to act with love
                    consistency and dignity. Our &quot;connects&quot; speaks to
                    our core belief. When we connect with compassion, we can
                    change lives forever.
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
