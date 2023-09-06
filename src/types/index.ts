import { EventId } from "@mysten/sui.js/src/client";

export interface BottleSummary {
  bottleId: string;
}

export interface PaginatedBottleSummary {
  data: BottleSummary[];
  hasNextPage: boolean;
  nextCursor?: EventId | null;
}
