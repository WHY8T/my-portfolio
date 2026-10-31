import Hero from "@/components/home/Hero";
import Clients from "@/components/home/Clients";
import Intro from "@/components/home/Intro";
import SelectedWork from "@/components/home/SelectedWork";
import Toolkit from "@/components/tools/Toolkit";
import Feedback from "@/components/feedback/Feedback";
import Marquee from "@/components/ui/Marquee";
import AboutTeaser from "@/components/home/AboutTeaser";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Clients />
      <Intro />
      <SelectedWork />
      <Toolkit />
      <Feedback />
      <Marquee />
      <AboutTeaser />
      <ContactCTA />
    </>
  );
}
