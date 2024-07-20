import SongListDetail from "../SongListDetail";
import React, { useCallback, useEffect, useState } from "react";
import { Divider, Grid, MenuItem, TextField } from "@mui/material";
import Histogram from "./Histogram";
import { metricList } from "../../Providers/Database/ulti";
import Scatterwrapper from "./Scatterwrapper";
import PCAplot from "./PCAplot";

function VizPanel({ countries, data, source, onChangeSource, onSelect }) {
  const [histindata, sethisindata] = useState([]);
  const [hovered, sethovered] = useState(null);
  useEffect(() => {
    const histindata = metricList.map(({ key, label }) => ({
      key,
      label,
      data: data.map((d) => d[key]),
    }));
    sethisindata(histindata);
  }, [data]);
  const onHover = useCallback((data) => {
    sethovered(data);
  }, []);
  return (
    <Grid container sx={{ position: "relative", height: "100%" }} spacing={1}>
      <Grid item xs={3}>
        <SongListDetail countries={countries} />
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              id="viz-selection-source"
              select
              label="Viz source"
              value={source}
              variant="standard"
              fullWidth
              onChange={(event) => {
                onChangeSource(event.target.value);
              }}
            >
              <MenuItem value="event">Event list</MenuItem>
              <MenuItem value="selected">Selected list</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} container justifyContent="center" spacing={1}>
            {histindata.map(({ key, label, data }) => (
              <Grid key={key} item style={{ height: 100, width: 300 }}>
                <Histogram name={label} data={data} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Scatterwrapper
              data={data}
              selectList={metricList}
              onSelect={onSelect}
              onHover={onHover}
              hovered={hovered}
            />
          </Grid>
          <Grid item xs={6}>
            <PCAplot
              data={data}
              selectList={metricList}
              onSelect={onSelect}
              onHover={onHover}
              hovered={hovered}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default VizPanel;
