import { Footer } from "@/components/landing/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div>{children}</div>
      <Footer />
    </main>
  );
}
