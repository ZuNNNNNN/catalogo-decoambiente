import { Hero } from "@/components/sections/Hero/Hero";
import { Categories } from "@/components/sections/Categories/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts/FeaturedProducts";
import { Benefits } from "@/components/sections/Benefits/Benefits";
import { Testimonials } from "@/components/sections/Testimonials/Testimonials";
import { CTA } from "@/components/sections/CTA/CTA";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Benefits />
      <Testimonials />
      <CTA />
    </>
  );
};
