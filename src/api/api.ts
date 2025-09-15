import axios from "axios";
import type { Artwork, ArticApiResponse } from "../types";

const BASE = "https://api.artic.edu/api/v1/artworks";

export async function fetchArtworks(
  page = 1,
  limit = 10
): Promise<{ items: Artwork[]; total: number; page: number; limit: number }> {
  const { data: json } = await axios.get<ArticApiResponse>(BASE, {
    params: {
      page,
      limit,
      fields:
        "id,title,place_of_origin,artist_display,inscriptions,date_start,date_end",
    },
  });

  const items: Artwork[] = (json.data || []).map((d: any) => ({
    id: d.id,
    title: d.title ?? null,
    place_of_origin: d.place_of_origin ?? null,
    artist_display: d.artist_display ?? null,
    inscriptions: d.inscriptions ?? null,
    date_start: d.date_start ?? null,
    date_end: d.date_end ?? null,
  }));

  const total =
    json.pagination?.total ??
    (json.pagination?.total_pages
      ? json.pagination.total_pages * (json.pagination.limit ?? limit)
      : page * limit);

  return { items, total, page, limit };
}
