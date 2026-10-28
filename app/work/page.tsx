import type { Metadata } from "next";
import WorkCards from "@/components/work/WorkCards";
import HoloHeading from "@/components/ui/HoloHeading";
import { projects } from "@/content/config";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects — brand sites, products and experiments.",
};

export default function WorkPage() {
  return (
    <div className="pt-32 md:pt-44">
      <div className="flex items-end justify-between px-5 pb-2 md:px-10">
        <HoloHeading lines={["every project", "worth showing."]} size="giant" />
        <p className="type-label hidden pb-3 md:block">{projects.length} projects</p>
      </div>
      <div className="pt-10 md:pt-14">
        <WorkCards items={projects} />
      </div>
    </div>
  );
}
