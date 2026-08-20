export type GalleryPhoto = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string | null;
  createdTime: string | null;
  size: string | null;
  width: number | null;
  height: number | null;
  favorite: boolean;
};

export type GalleryFolderNode = {
  id: string;
  name: string;
  photos: GalleryPhoto[];
  folders: GalleryFolderNode[];
};

export type GalleryMeta = {
  id: string;
  slug: string;
  title: string;
  clientName: string | null;
  eventType: string | null;
  eventDate: string | null;
  requiresPayment: boolean;
  downloadsEnabled: boolean;
  receiptUploadedAt: string | null;
};
