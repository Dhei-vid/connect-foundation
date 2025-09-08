import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen grid grid-cols-2">
      <div className="h-fit">
        <Image
          className="object-cover object-center h-screen w-full"
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUyak50B6hURuAJsjPlSfz8M0U7k3F8NWUFg&s"
          }
          unoptimized={true}
          alt={"image of kids"}
          width={500}
          height={800}
        />
      </div>
      <main>{children}</main>
    </main>
  );
}
