import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
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
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Image */}
        <div className="relative">
          <div className="relative inset-0">
            <Image
              className="object-cover object-center h-screen w-full"
              src={
                "https://images.unsplash.com/photo-1611183110451-7e156d15581d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGltYWdlcyUyMG9mJTIwaGFwcHklMjBibGFjayUyMGNoaWxkcmVufGVufDB8fDB8fHww"
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
        <main className="overflow-y-auto min-h-screen flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </main>
  );
}
