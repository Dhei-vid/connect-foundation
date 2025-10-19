import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrphanageAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <Image
            src={"/logo.png"}
            alt={"icon"}
            width={32}
            height={32}
            className={"rounded-lg"}
          />
          <Link
            href={"/"}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-main-red transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
        
        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="p-4">
            <div className="w-full max-w-2xl mx-auto">{children}</div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Image */}
        <div className="relative h-screen overflow-hidden">
          <div className="relative inset-0">
            <Image
              className="bg-cover bg-center h-full w-full"
              src={
                "https://images.unsplash.com/photo-1505148359496-35d8d1ec9645?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjY1fHxibGFjayUyMGNoaWxkcmVuJTIwaW4lMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D"
              }
              alt={"image of kids"}
              width={500}
              height={800}
              priority
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

        {/* Right side - Form */}
        <div className="h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="min-h-full flex items-center justify-center p-8">
            <div className="w-full max-w-4xl">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
