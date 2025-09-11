import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrphanageAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid grid-cols-2">
      {/* left side - fixed */}
      <div className="relative h-screen overflow-hidden">
        <div className="relative inset-0">
          <Image
            className="object-cover object-bottom h-full w-full"
            src={
              "https://images.unsplash.com/photo-1609046395281-334c3b49552a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGJsYWNrJTIwa2lkcyUyMGhhcHB5fGVufDB8fDB8fHww"
            }
            alt={"image of kids"}
            width={500}
            height={800}
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-800/40 to-gray-900/60" />

        {/* Header - Fixed to top */}
        <div className="absolute top-0 left-0 right-0 z-10 p-8">
          <div className="flex flex-row justify-between items-center">
            <Image
              src={"/logo.png"}
              alt={"icon"}
              width={40}
              height={40}
              className={"rounded-lg"}
            />

            <Link
              href={"/"}
              className="flex flex-row items-center gap-2 text-white bg-transparent border border-white p-2 rounded-full hover:bg-white hover:text-main-blue transition-all ease-in-out duration-200"
            >
              <ArrowLeft size={18} />
              Back to website
            </Link>
          </div>
        </div>
      </div>

      {/* right side - scrollable */}
      <div className="h-screen overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">{children}</div>
        </div>
      </div>
    </main>
  );
}
