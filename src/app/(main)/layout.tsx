import { Footer } from "@/components/landing/footer";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Toaster />
      <div>{children}</div>
      <Footer />
    </main>
  );
}
