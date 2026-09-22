import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { ProjectArchive } from "@/components/graveyard/ProjectArchive";

export const Route = createFileRoute("/_shell/revivable")({
  head: () => ({
    meta: [
      { title: "Revivable — Project Graveyard" },
      { name: "description", content: "Projects marked as resurrection candidates, ranked by remaining work." },
      { property: "og:title", content: "Revivable — Project Graveyard" },
      { property: "og:description", content: "Dead, but not beyond saving." },
    ],
  }),
  component: RevivablePage,
});

function RevivablePage() {
  return (
    <div>
      <PageHeader
        eyebrow="// resurrection_queue"
        title="REVIVABLE"
        description="Dead, but not beyond saving. These graves still emit an ember signal."
      />
      <ProjectArchive lockStatus="revivable" />
    </div>
  );
}
