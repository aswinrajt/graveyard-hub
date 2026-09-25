import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderArchive } from "lucide-react";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { CollectionsSkeleton } from "@/components/graveyard/GraveyardSkeletons";
import { useCollections } from "@/lib/queries";

export const Route = createFileRoute("/_shell/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Project Graveyard" },
      { name: "description", content: "Group your buried projects into themed crypts and collections." },
      { property: "og:title", content: "Collections — Project Graveyard" },
      { property: "og:description", content: "Themed crypts for your archived project history." },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { data: collections = [], isLoading } = useCollections();

  return (
    <div>
      <PageHeader
        eyebrow="// crypt_directory"
        title="COLLECTIONS"
        description="Themed crypts. Group remains by era, ambition, or shared regret."
      />
      {isLoading ? (
        <CollectionsSkeleton />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((c, i) => (
          <section
            key={c.id}
            className="animate-rise group rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_36px_-16px_var(--primary)]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <FolderArchive className="size-5 text-primary/80" />
            <h2 className="mt-3 font-display text-lg font-bold tracking-wide">{c.name}</h2>
            <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">{c.description}</p>
            <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-4">
              {c.projects.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/project/$projectId"
                    params={{ projectId: p.id }}
                    className="flex items-center justify-between font-mono text-[0.68rem] text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="truncate">{p.name}</span>
                    <span>{p.progress}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      )}
    </div>
  );
}
