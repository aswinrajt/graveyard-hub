import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { ProjectArchive } from "@/components/graveyard/ProjectArchive";

export const Route = createFileRoute("/_shell/graveyard")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The Graveyard — Project Archive" },
      {
        name: "description",
        content: "Search and filter every archived, abandoned and buried project in your graveyard.",
      },
      { property: "og:title", content: "The Graveyard — Project Archive" },
      { property: "og:description", content: "A searchable cemetery of unfinished developer projects." },
    ],
  }),
  component: GraveyardPage,
});

function GraveyardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="// sector_01 · full_index"
        title="THE GRAVEYARD"
        description="Every plot, every epitaph. Filter the dead by status, technology, or cause of death."
      />
      <ProjectArchive />
    </div>
  );
}
