import { Platform } from 'src/app/pages/influencer/profile/models/enums';

export const platformNames = Object.values(Platform).map((p) =>
  p.toLowerCase(),
) as Lowercase<Platform>[];
