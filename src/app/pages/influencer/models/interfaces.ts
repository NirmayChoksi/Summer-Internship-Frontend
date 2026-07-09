export interface PublishMedia {
  imageUrl?: boolean;
  videoUrl?: boolean;
  caption?: boolean;
  isReel?: boolean;
}

export interface Caption {
  tone: string;
  caption: string;
}

export interface CaptionResult {
  captions: Caption[];
  hashtags: string[];
}

export interface RefineCaptionRequest {
  caption: string;
  instruction: string;
}
