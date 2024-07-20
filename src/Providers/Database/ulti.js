export const metricList = [
  { key: "track_danceability", label: "Danceability", radar: true },
  { key: "track_speechiness", label: "Speechiness", radar: true },
  { key: "track_acousticness", label: "Acousticness", radar: true },
  { key: "track_instrumentalness", label: "Instrumentalness", radar: true },
  { key: "track_liveness", label: "Liveness", radar: true },
  { key: "track_energy", label: "Energy" },
  { key: "track_valence", label: "Valence" },
];

export const metricRadarList = metricList.filter((d) => d.radar);
