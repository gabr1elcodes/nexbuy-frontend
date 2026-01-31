import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import HeroBanner from "@/components/dashboard/banners/HeroBanner";
import CategoriesSection from "@/components/dashboard/products/CategoriesSection";
import FeaturedProducts from "@/components/dashboard/products/FeaturedProducts";
import PromoBanner from "@/components/dashboard/banners/PromoBanner"


export default function DashboardHome() {
  return (
      
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <HeroBanner />
      <main className="flex-1 flex flex-col overflow-y-auto pt-6 px-4 md:px-8 lg:px-16 space-y-12">
        <CategoriesSection />
        <FeaturedProducts />
        <PromoBanner />
      </main>
    </div>
  );
}
