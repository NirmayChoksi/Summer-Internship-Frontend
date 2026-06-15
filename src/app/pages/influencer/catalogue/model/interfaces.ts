export interface Catalogue {
  _id: string;
  profile: string;
  path: string;
  url: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  name: string;
  type: string;
}

export interface InstagramMedia {
  id: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl: string;
  caption: string;
  permalink: string;
  createdAt: string;
}
