import { TopNav } from "@/components/navigation/top-nav";
import HeroLayout from "@/components/general/hero-layout";

export default function Page() {
  return (
    <div className="min-h-screen">
      <HeroLayout bgImage="https://images.pexels.com/photos/18267265/pexels-photo-18267265.jpeg">
        <TopNav />
      </HeroLayout>
      <div>Report</div>
    </div>
  );
}
