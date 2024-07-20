import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { useSpring, animated, easings } from "@react-spring/web";
import { styled } from "@mui/material/styles";
import { useState, useRef, useEffect, useMemo } from "react";
import { format } from "d3";
import "./index.css";
import AutoSizer from "lp-react-virtualized-auto-sizer-react-18";
import PaperCustom from "../PaperCustom";
// import {Helmet} from "react-helmet";
import RadarChart from "../RadarChart";
import Map from "../Map";
import Favorite from "@mui/icons-material/Favorite";
import spotifyIcon from "../../assets/Spotify_icon.svg";
import wikiIcon from "../../assets/wikilogo.png";
import musicbrainzIcon from "../../assets/musicbrainlogo.png";
import youtubeIcon from "../../assets/youtubelogo.png";
import geniusIcon from "../../assets/geniuslogo.png";
import { metricRadarList } from "../../Providers/Database/ulti";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <ExpandMoreIcon {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function genderIcon(g) {
  switch (g) {
    case "male":
      return { avatar: <MaleIcon style={{ marginRight: -12 }} />, label: "" };
    case "female":
      return { avatar: <FemaleIcon style={{ marginRight: -12 }} />, label: "" };
    default:
      return { label: g };
  }
}

function DetailCard({ data, onSelect, meanradar }) {
  const timeStation = moment(data.time_station).format("LLL");
  const duration = moment.utc(data.track_duration * 1000).format("HH:mm:ss");
  const stream_title = data.stream_title ?? "N/A";
  const analyticData = useMemo(() => [data], [data]);
  const analyticAxis = useMemo(() => metricRadarList, []);

  return (
    <Stack spacing={1}>
      <PaperCustom>
        <Typography
          component="div"
          variant="h2"
          onClick={() => onSelect({ station: [data.station] }, data)}
        >
          {data.station}
        </Typography>
        {/*<Typography component="div" variant="subtitle1" color="text.secondary">*/}
        {/*    Form: <Chip label={data.station_form} size={'small'}/>*/}
        {/*</Typography>*/}
        <table style={{ width: "100%" }}>
          <colgroup>
            <col style={{ width: 130 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>Form</td>
              <td>
                <Stack
                  direction={"row"}
                  spacing={1}
                  flexWrap
                  sx={{ width: "100%", flexWrap: "wrap" }}
                >
                  <Chip label={data.station_form} size={"small"} />
                  {data.station_frequency && (
                    <>
                      {data.station_frequency.map((d) => (
                        <Chip label={d} key={d} size={"small"} />
                      ))}
                    </>
                  )}{" "}
                </Stack>
              </td>
            </tr>
            <tr>
              <td>Station URL</td>
              <td>
                <Link
                  href={data.station_url}
                  target={"_blank"}
                  color={"secondary"}
                >
                  {data.station_url}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Location</td>
              <td>
                <Link
                  target={"_blank"}
                  color={"secondary"}
                  href={`https://maps.google.com/?q=${data.lat},${data.long}`}
                >
                  <MapIcon />
                  {data.city}, {data.country}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Radio Garden URL</td>
              <td>
                <Link href={data.url} target={"_blank"} color={"secondary"}>
                  {data.url}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Formats</td>
              <td>
                {data.station_format && (
                  <Stack
                    direction={"row"}
                    spacing={1}
                    flexWrap
                    sx={{ width: "100%", flexWrap: "wrap" }}
                  >
                    {data.station_format.split(",").map((d) => (
                      <Chip label={d} key={d} size={"small"} />
                    ))}
                  </Stack>
                )}
              </td>
            </tr>
            <tr>
              <td>Genres</td>
              <td>
                {data.station_genre && (
                  <Stack
                    direction={"row"}
                    spacing={1}
                    flexWrap
                    sx={{ width: "100%", flexWrap: "wrap" }}
                  >
                    {data.station_genre.map((d) => (
                      <Chip label={d} key={d} size={"small"} />
                    ))}
                  </Stack>
                )}
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{data.station_description}</td>
            </tr>
          </tbody>
        </table>
      </PaperCustom>

      <PaperCustom>
        <table style={{ width: "100%" }}>
          <colgroup>
            <col style={{ width: 130 }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>Stream name</td>
              <td>{stream_title}</td>
            </tr>
          </tbody>
          {/*<tr><td>Stream URL</td><td><Link href={data.stream_url} target={'_blank'} color={'secondary'}>{data.stream_url}</Link></td></tr>*/}
        </table>
      </PaperCustom>
      {data.artist_info && (
        <PaperCustom>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{ flex: "1 0 auto", display: "flex" }}>
                <Avatar
                  aria-label="recipe"
                  src={data.artist_info.artist_image_url}
                  sx={{ mr: 1 }}
                >
                  {data.artist_info.artist_name[0]}
                </Avatar>
                <div>
                  <Typography variant="h4" color={"text.primary"}>
                    {data.artist_info.artist_name}
                  </Typography>
                  <Typography variant="subtitle2">
                    {data.artist_info.artist_type}
                  </Typography>
                </div>
              </Box>
              <Typography
                component="div"
                variant="subtitle1"
                color="text.secondary"
              >
                {data.artist_info.artist_description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <table style={{ width: "100%" }}>
                <colgroup>
                  <col style={{ width: 130 }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <td>Popularity</td>
                    <td>
                      <Chip
                        icon={<Favorite />}
                        sx={{ marginRight: 1 }}
                        label={data.artist_info.artist_popularity}
                        size={"small"}
                      />
                      ({format(",")(data.artist_info.artist_followers)}{" "}
                      followers)
                    </td>
                  </tr>
                  <tr>
                    <td>From</td>
                    <td>{data.artist_info.artist_country ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Genres</td>
                    <td>
                      {data.artist_info.artist_genres &&
                        data.artist_info.artist_genres.map((t) => (
                          <Chip key={t} label={t} size={"small"} />
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <td>Instruments</td>
                    <td>
                      {data.artist_info.artist_instruments.map((t) => (
                        <Chip key={t} label={t} size={"small"} />
                      ))}
                    </td>
                  </tr>
                  {data.artist_info.artist_members &&
                  data.artist_info.artist_members.length ? (
                    <tr>
                      <td>Members</td>
                      <td>
                        {data.artist_info.artist_members.map(
                          ({
                            _id,
                            artist_name,
                            artist_image_url,
                            artist_genders,
                            artist_sexualorientations,
                            artist_ethnicities,
                            artist_voicetypes,
                          }) => (
                            <Chip
                              avatar={
                                <Avatar
                                  alt={artist_name}
                                  src={artist_image_url}
                                />
                              }
                              key={_id}
                              label={
                                <>
                                  <strong>{artist_name}</strong>
                                  {artist_genders && (
                                    <Chip
                                      title={`Gender: ${artist_genders}`}
                                      color={"error"}
                                      size={"small"}
                                      {...genderIcon(artist_genders)}
                                    />
                                  )}
                                  {artist_sexualorientations && (
                                    <Chip
                                      title={`Sexual Orientations: ${artist_sexualorientations}`}
                                      size={"small"}
                                      {...genderIcon(artist_sexualorientations)}
                                    />
                                  )}
                                  {artist_ethnicities && (
                                    <Chip
                                      title={`Ethnicities: ${artist_ethnicities}`}
                                      size={"small"}
                                      {...genderIcon(artist_ethnicities)}
                                    />
                                  )}
                                  {artist_voicetypes &&
                                  artist_voicetypes.length ? (
                                    <Chip
                                      title={"Voice types"}
                                      label={artist_voicetypes.join(", ")}
                                      size={"small"}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </>
                              }
                              variant={"outlined"}
                            />
                          )
                        )}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td>Website URL</td>
                    <td>
                      <Link
                        href={data.artist_info.artist_website}
                        target={"_blank"}
                        color={"secondary"}
                      >
                        {data.artist_info.artist_website}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Identifiers</td>
                    <td>
                      <IconButton
                        href={`https://open.spotify.com/artist/${data.artist_info.artist_id}`}
                        target={"_blank"}
                      >
                        <img src={spotifyIcon} width={30} loading="lazy" />
                      </IconButton>
                      {data.artist_info.artist_qid && (
                        <IconButton
                          href={`https://wikidata.org/wiki/${data.artist_info.artist_qid}`}
                          target={"_blank"}
                        >
                          <img src={wikiIcon} width={30} loading="lazy" />
                        </IconButton>
                      )}
                      {data.artist_info.artist_YouTubeID && (
                        <IconButton
                          href={`https://www.youtube.com/channel/${data.artist_info.artist_YouTubeID}`}
                          target={"_blank"}
                        >
                          <img src={youtubeIcon} width={30} loading="lazy" />
                        </IconButton>
                      )}
                      {data.artist_info.artist_MusicBrainzID && (
                        <IconButton
                          href={`https://musicbrainz.org/artist/${data.artist_info.artist_MusicBrainzID}`}
                          target={"_blank"}
                        >
                          <img
                            src={musicbrainzIcon}
                            width={30}
                            loading="lazy"
                          />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                </tbody>
                {/*<tr><td>Stream URL</td><td><Link href={data.stream_url} target={'_blank'} color={'secondary'}>{data.stream_url}</Link></td></tr>*/}
              </table>
            </Grid>
          </Grid>
        </PaperCustom>
      )}
      <PaperCustom elevation={3}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography color="text.secondary" gutterBottom>
              {" "}
              {timeStation}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="div"
              onClick={
                data.track_name
                  ? () => onSelect({ track_name: [data.track_name] })
                  : null
              }
            >
              {data.track_name}
            </Typography>
            <Typography
              component="div"
              variant="subtitle1"
              color="text.secondary"
            >
              {data.track_description}
            </Typography>
            <table style={{ width: "100%" }}>
              <colgroup>
                <col style={{ width: 130 }} />
                <col />
              </colgroup>
              <tbody>
                {data.track_form && (
                  <tr>
                    <td>Form</td>
                    <td>{data.track_form}</td>
                  </tr>
                )}
                {data.track_composers && data.track_composers.length ? (
                  <tr>
                    <td>Composers</td>
                    <td>
                      {data.track_composers.map((t) => (
                        <Chip key={t} label={t} size={"small"} />
                      ))}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
                {data.track_lyricists && data.track_lyricists.length ? (
                  <tr>
                    <td>Lyricists</td>
                    <td>
                      {data.track_lyricists.map((t) => (
                        <Chip key={t} label={t} size={"small"} />
                      ))}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
                {data.track_language && (
                  <tr>
                    <td>Language</td>
                    <td>{data.track_language}</td>
                  </tr>
                )}
                {data.track_year_released && (
                  <tr>
                    <td>Year released</td>
                    <td>{data.track_year_released}</td>
                  </tr>
                )}
                {data.track_duration && (
                  <tr>
                    <td>Duration</td>
                    <td>{duration}</td>
                  </tr>
                )}
                {data.track_popularity && (
                  <tr>
                    <td>Popularity</td>
                    <td>
                      <Chip
                        icon={<Favorite />}
                        label={data.track_popularity}
                        size={"small"}
                      />
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Key </td>
                  <td>
                    {data.track_key}, {data.track_mode}
                  </td>
                </tr>
                <tr>
                  <td>Beats per Measure</td>
                  <td>{data.track_beatsperbar}</td>
                </tr>
                {data.track_genre && (
                  <tr>
                    <td>Genre</td>
                    <td>{data.track_genre}</td>
                  </tr>
                )}
                {data.track_loudness && (
                  <tr>
                    <td>Loudness</td>
                    <td>{data.track_loudness} dB</td>
                  </tr>
                )}
                <tr>
                  <td>Platform</td>
                  <td>
                    {data.track_id && (
                      <IconButton
                        href={`https://open.spotify.com/track/${data.track_id}`}
                        target={"_blank"}
                      >
                        <img src={spotifyIcon} width={30} loading="lazy" />
                      </IconButton>
                    )}
                    {data.track_qid && (
                      <IconButton
                        href={`https://wikidata.org/wiki/${data.track_qid}`}
                        target={"_blank"}
                      >
                        <img src={wikiIcon} width={30} loading="lazy" />
                      </IconButton>
                    )}
                    {data.track_geniusID && (
                      <IconButton
                        href={`https://genius.com/${data.track_geniusID}`}
                        target={"_blank"}
                      >
                        <img src={geniusIcon} width={30} loading="lazy" />
                      </IconButton>
                    )}
                    {data.track_YouTubeID && (
                      <IconButton
                        href={`https://www.youtube.com/watch?v=${data.track_YouTubeID}`}
                        target={"_blank"}
                      >
                        <img src={youtubeIcon} width={30} loading="lazy" />
                      </IconButton>
                    )}
                    {data.track_MusicBrainzID && (
                      <IconButton
                        href={`https://musicbrainz.org/work/${data.track_MusicBrainzID}`}
                        target={"_blank"}
                      >
                        <img src={musicbrainzIcon} width={30} loading="lazy" />
                      </IconButton>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
          <Grid item xs={12}>
            {data.track_instrumentation && data.track_instrumentation.length ? (
              <Stack
                direction={"row"}
                spacing={1}
                flexWrap
                sx={{ width: "100%", flexWrap: "wrap" }}
              >
                <Typography>Instruments: </Typography>
                {data.track_instrumentation.map((t) => (
                  <Chip key={t} label={t} size={"small"} />
                ))}
              </Stack>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Divider sx={{ mt: 2, mb: 2, flexGrow: 1 }} />
              <Typography
                variant={"h5"}
                component={"div"}
                sx={{ margin: "auto" }}
              >
                Metrics
              </Typography>
              <Divider sx={{ mt: 2, mb: 2, flexGrow: 1 }} />
            </Grid>
            <AutoSizer style={{ height: 300, width: "100%" }}>
              {({ height, width }) => {
                return (
                  <RadarChart
                    inputData={analyticData}
                    meanradar={meanradar}
                    axisInfo={analyticAxis}
                    height={height - 40}
                    width={width}
                  />
                );
              }}
            </AutoSizer>
          </Grid>
          {/*<Grid item xs={6}>*/}
          {/*    <Grid container>*/}
          {/*        <Divider sx={{mt: 2, mb: 2, flexGrow: 1}}/>*/}
          {/*        <Typography variant={"h5"} component={'div'} sx={{margin: 'auto'}}>*/}
          {/*            Lyrics {data.track_language ? `(${data.track_language})` : ""}*/}
          {/*        </Typography>*/}
          {/*        <Divider sx={{mt: 2, mb: 2, flexGrow: 1}}/>*/}
          {/*    </Grid>*/}
          {/*</Grid>*/}
        </Grid>
      </PaperCustom>
    </Stack>
  );
}
export default DetailCard;

function CollapsibleComp({ header, banner, defaultValue, ...props }) {
  const [open, setopen] = useState(defaultValue);
  const runningText = useSpring({
    reset: open,
    cancel: open,
    config: { duration: 20000 },
    loop: !open,
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(-100%)" },
  });
  return (
    <Card elevation={10} sx={{ mt: 1 }}>
      <CardActions disableSpacing>
        <Typography variant={"h5"}>{header}</Typography>
        {banner && !open && (
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              marginLeft: 10,
              marginRight: 10,
              whiteSpace: "nowrap",
            }}
          >
            <Typography variant={"subtitle2"}>
              <animated.div style={runningText} className={"textbanner"}>
                {banner}
              </animated.div>
              {/*<div className={'textbanner'}>{banner} | {banner}</div>*/}
            </Typography>
          </div>
        )}
        <ExpandMore expand={open} onClick={() => setopen(!open)} />
      </CardActions>
      <Collapse in={open} unmountOnExit={true} {...props} />
    </Card>
  );
}
