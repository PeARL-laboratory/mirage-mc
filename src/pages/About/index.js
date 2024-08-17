import React, { useState, Fragment } from "react";
import QuestionDialog from "../../components/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { SET_MENU } from "../../reducer/actions/setting";
import { Link, Stack, Typography } from "@mui/material";
import { Image } from "@mui/icons-material";
import spotifylogo from "../../assets/spotifylogo.png";

const AboutDialog = ({ children }) => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state) => state.customization.opened);
  const [isProcessing, setIsProcessing] = useState(false);

  const closeDialog = () => {
    dispatch({ type: SET_MENU, opened: !dialogOpen });
  };
  // console.log('I am CCCCCCCCC')
  return (
    <Fragment>
      {children}
      <QuestionDialog
        isOpen={dialogOpen}
        handleClose={closeDialog}
        isProcessing={isProcessing}
        title={""}
        maxWidth={"md"}
        message={
          <>
            <Typography variant={"h5"} sx={{ marginBottom: 2 }}>
              Welcome to the Music Informatics for Radio Across the GlobE
              (MIRAGE) project! The first development release (v
              {process.env.REACT_APP_DATA_APP_VERSION}) of this online dashboard
              allows you to access, interact with, and export meta data and
              musicological features from the music found on internet radio.
            </Typography>
            <Typography variant={"h5"} sx={{ marginBottom: 2 }}>
              The MIRAGE dashboard (v{process.env.REACT_APP_DATA_APP_VERSION})
              consists of metadata (e.g., artist name, event title, etc.) for
              one million events that were streaming on the Radio Garden
              streaming service during the months October-January 2022-2023.
              Each of 100 metadata variables pertaining to the location,
              station, event, artist, and track was obtained from either the
              Radio Garden API, the Natural Earth map dataset, the internet
              radio station stream encoder, review by human annotators, or
              online music libraries (e.g., WikiData, Spotify, MusicBrainz).
            </Typography>
            <Typography variant={"h5"} sx={{ marginBottom: 1 }}>
              If you are a copyright owner for any of the metadata that appears
              in MIRAGE and would like us to remove your metadata, please
              contact the developer team at the following email address:{" "}
              <a href="mailto:miragedashboard@gmail.com">
                miragedashboard@gmail.com
              </a>
            </Typography>
            <Typography variant={"h5"} sx={{ marginBottom: 1 }}>
              If you plan to use any of the data or visualizations available on
              the MIRAGE dashboard, please cite the following publication:
            </Typography>
            <Typography variant={"h5"} sx={{ marginBottom: 2, marginLeft: 2 }}>
              Nguyen, Ngan V.T., Acosta, Elizabeth A.M., Dang, Tommy, and David
              R.W. Sears. (2024). Exploring internet radio across the globe with
              the MIRAGE online dashboard. In Proceedings of the International
              Society of Music Information Retrieval Conference (ISMIR), San
              Francisco, California, USA.
            </Typography>
            <Stack
              direction={"row"}
              width={"100%"}
              spacing={2}
              justifyContent={"center"}
            >
              <img
                width={150}
                srcSet={
                  "https://yellow.radio/wp-content/uploads/2020/04/unnamed.png"
                }
                src={
                  "https://yellow.radio/wp-content/uploads/2020/04/unnamed.png"
                }
                alt={"Spotify logo"}
                loading="lazy"
              />
              <img
                width={150}
                srcSet={spotifylogo}
                src={spotifylogo}
                alt={"Spotify logo"}
                loading="lazy"
              />
              <img
                width={150}
                srcSet={
                  "https://upload.wikimedia.org/wikipedia/commons/c/cd/Wikidata_stamp.png"
                }
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/c/cd/Wikidata_stamp.png"
                }
                alt={"Wikidata stamp"}
                loading="lazy"
              />
            </Stack>
          </>
        }
      />
    </Fragment>
  );
};

export default AboutDialog;
