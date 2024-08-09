import { isArray } from "lodash";

export const metricList = [
  { key: "track_danceability", label: "Danceability", radar: true },
  { key: "track_speechiness", label: "Speechiness", radar: true },
  { key: "track_acousticness", label: "Acousticness", radar: true },
  { key: "track_instrumentalness", label: "Instrumentalness", radar: true },
  { key: "track_liveness", label: "Liveness", radar: true },
  { key: "track_energy", label: "Energy" },
  { key: "track_valence", label: "Valence" },
  { key: "track_year_released", label: "Track Year Released" },
  { key: "track_popularity", label: "Track Popularity" },
  { key: "track_tempo", label: "Tempo" },
];

export const metricRadarList = metricList.filter((d) => d.radar);

export const rankMetricList = [
  { key: "artist_genres", label: "Artist Genres", isArray: true },
  { key: "artist_country", label: "Artist Country" },
  { key: "track_key", label: "Track Key", isArray: true },
];
