import { Toaster } from "@/components/ui/sonner";

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Toaster />
      <div>{children}</div>
    </main>
  );
}
