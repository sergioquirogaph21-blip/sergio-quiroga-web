import { Heart } from "lucide-react";

export type FavoriteItem = {
  id: string;
  fileId: string;
  fileName: string;
  thumbnailLink: string | null;
  createdAt: string;
};

export function FavoritesViewer({
  slug,
  favorites,
}: {
  slug: string;
  favorites: FavoriteItem[];
}) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-line bg-paper py-16 text-center text-ink-soft">
        <Heart className="h-5 w-5" />
        <p className="text-sm">El cliente todavía no marcó fotos como favoritas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {favorites.map((fav) => {
        const src = fav.thumbnailLink
          ? `/api/galeria/${slug}/thumb/${fav.fileId}?tl=${encodeURIComponent(fav.thumbnailLink)}&s=480`
          : null;
        return (
          <div key={fav.id} className="overflow-hidden rounded-sm border border-line bg-paper">
            <div className="relative aspect-square bg-paper-dim">
              {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={fav.fileName} loading="lazy" className="h-full w-full object-cover" />
              )}
              <Heart className="absolute right-2 top-2 h-4 w-4 fill-red-500 text-red-500 drop-shadow" />
            </div>
            <p className="truncate px-3 py-2 text-xs text-ink-soft">{fav.fileName}</p>
          </div>
        );
      })}
    </div>
  );
}
