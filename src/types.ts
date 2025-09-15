export interface Artwork {
  id: number;
  title: string | null;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

export interface ArticApiResponse {
  data: any[]; // raw server data
  pagination?: {
    total: number;
    limit: number;
    total_pages?: number;
    current_page?: number;
  };
}
