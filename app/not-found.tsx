import HoloHeading from "@/components/ui/HoloHeading";
import MagneticButton from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-start justify-center px-5 md:px-10">
      <p className="type-label mb-6">404 — nothing here but the dark</p>
      <HoloHeading lines={["this page was", "never lit."]} size="giant" />
      <div className="mt-12">
        <MagneticButton href="/">back to the light</MagneticButton>
      </div>
    </div>
  );
}
