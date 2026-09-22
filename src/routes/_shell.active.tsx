import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { ProjectArchive } from "@/components/graveyard/ProjectArchive";

export const Route = createFileRoute("/_shell/active")({
  head: () => ({
    meta: [
      { title: "Active Projects — Project Graveyard" },
      { name: "description", content: "The projects still breathing: active repositories with a recent pulse." },
      { property: "og:title", content: "Active Projects — Project Graveyard" },
      { property: "og:description", content: "Repositories that have not yet been buried." },
    ],
  }),
  component: ActivePage,
});

function ActivePage() {
  return (
    <div>
      <PageHeader
        eyebrow="// vitals · pulse_detected"
        title="ACTIVE PROJECTS"
        description="Still warm. Still committing. Handle with care — most graves start here."
      />
      <ProjectArchive lockStatus="active" />
    </div>
  );
}
