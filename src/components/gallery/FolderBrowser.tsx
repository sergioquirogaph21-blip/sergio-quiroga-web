"use client";

import { ChevronRight, Folder, Home, Image as ImageIcon } from "lucide-react";
import { countPhotosRecursive } from "@/lib/gallery-tree";
import type { GalleryFolderNode } from "@/types/gallery";

export function FolderBrowser({
  pathNodes,
  currentNode,
  onBreadcrumbClick,
  onEnterFolder,
}: {
  pathNodes: GalleryFolderNode[];
  currentNode: GalleryFolderNode;
  onBreadcrumbClick: (depth: number) => void;
  onEnterFolder: (folderId: string) => void;
}) {
  if (pathNodes.length <= 1 && currentNode.folders.length === 0) return null;

  return (
    <div className="mb-8 space-y-6">
      {pathNodes.length > 1 && (
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
          {pathNodes.map((node, i) => (
            <span key={node.id} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-line" />}
              <button
                onClick={() => onBreadcrumbClick(i)}
                className={
                  i === pathNodes.length - 1
                    ? "font-medium text-ink"
                    : "flex items-center gap-1 hover:text-sand-dark"
                }
                disabled={i === pathNodes.length - 1}
              >
                {i === 0 && <Home className="h-3.5 w-3.5" />}
                {i === 0 ? "Inicio" : node.name}
              </button>
            </span>
          ))}
        </nav>
      )}

      {currentNode.folders.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {currentNode.folders.map((folder) => {
            const count = countPhotosRecursive(folder);
            return (
              <button
                key={folder.id}
                onClick={() => onEnterFolder(folder.id)}
                className="flex flex-col items-start gap-3 rounded-sm border border-line bg-paper p-5 text-left transition-colors hover:border-sand hover:bg-paper-dim"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand/15 text-sand-dark">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-ink">{folder.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
                    <ImageIcon className="h-3 w-3" />
                    {count} foto{count === 1 ? "" : "s"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
