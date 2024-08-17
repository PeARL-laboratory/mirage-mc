import SongListDetail from "../SongListDetail";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Divider,
  Grid,
  MenuItem,
  TextField,
  Stack,
  Typography,
  Card,
} from "@mui/material";
import Histogram from "./Histogram";
import { metricList, rankMetricList } from "../../Providers/Database/ulti";
import Scatterwrapper from "./Scatterwrapper";
import PCAplot from "./PCAplot";
import { semicolor } from "../../containers/LayoutContainer/theme";
import { colorArr } from "../Earth";
import { scaleOrdinal, maxIndex, rollup } from "d3";
import { isArray } from "lodash";
import Barchart from "./Barchart";

const TOP = 10;
function VizPanel({ countries, data, source, onChangeSource, onSelect }) {
  const [histindata, sethisindata] = useState([]);
  const [rankdata, setrankdata] = useState([]);
  const [colorKey, setColorKey] = useState(rankMetricList[0].key);
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

  const [rankMap, setrankMap] = useState({
    data: {},
    colorsCategory: () => {},
    getColor: () => {},
  });

  useEffect(() => {
    const countMap = {};
    data.forEach((d) => {
      if (isArray(d[colorKey])) {
        d[colorKey].forEach((e) => (countMap[e] = (countMap[e] ?? 0) + 1));
      } else if (d[colorKey] && d[colorKey] !== null) {
        countMap[d[colorKey]] = (countMap[d[colorKey]] ?? 0) + 1;
      }
    });
    let rankData = [];
    Object.keys(countMap).forEach((k) => {
      rankData.push({ title: k, count: countMap[k] });
    });
    rankData.sort((a, b) => b.count - a.count);
    rankData = rankData.slice(0, TOP);
    setrankdata(rankData);
  }, [colorKey, data]);
  useEffect(() => {
    const colorsCategory = (function (otherColor = "#ececec") {
      const scale = scaleOrdinal(colorArr);
      let master = (val) => {
        if (!val || val === "" || val.trim === "") return "#444444";
        const domain = scale.domain();
        if (domain.find((d) => d === val) || domain.length < TOP)
          return scale(val);
        else return otherColor;
      };
      master.domain = scale.domain;
      master.range = scale.range;
      return master;
    })();
    rankdata.forEach((d) => (d.color = colorsCategory(d.title)));
    const r = {};
    rankdata.forEach((element) => {
      r[element["title"]] = element;
    });
    setrankMap({
      data: r,
      colorsCategory,
      getColor: function (d) {
        if (isArray(d[colorKey])) {
          debugger;
          const i = maxIndex(d[colorKey], (e) => r[e]?.count);
          return colorsCategory(d[colorKey][i]);
        } else {
          return colorsCategory(d[colorKey]);
        }
      },
    });
  }, [rankdata]);
  return (
    <Grid container sx={{ position: "relative", height: "100%" }} spacing={1}>
      {/* <Grid item xs={3}>
        <SongListDetail countries={countries} />
      </Grid> */}
      <Grid item xs={9}>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ pt: 2 }}>
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
          <Grid item xs={12}>
            <Divider>Track histogram</Divider>
          </Grid>
          <Grid item xs={12} container justifyContent="center" spacing={1}>
            {histindata.map(({ key, label, data }) => (
              <Grid key={key} item style={{ height: 120, width: 300 }}>
                <Histogram name={label} data={data} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                pointerEvents: "all",
                overflowY: "auto",
                backgroundColor: (theme) =>
                  semicolor(theme.palette.background.paper),
              }}
            >
              <Stack
                direction={"collumn"}
                spacing={2}
                gap={2}
                sx={{ m: 1, p: 0 }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant={"h3"}>Top 10 </Typography>
                <TextField
                  size="small"
                  select
                  value={colorKey}
                  onChange={(event) => {
                    setColorKey(event.target.value);
                  }}
                >
                  {rankMetricList.map(({ key, label }) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Barchart data={rankdata} />
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Scatterwrapper
              data={data}
              selectList={metricList}
              onSelect={onSelect}
              onHover={onHover}
              hovered={hovered}
              getColor={rankMap}
            />
          </Grid>
          <Grid item xs={6}>
            <PCAplot
              data={data}
              selectList={metricList}
              onSelect={onSelect}
              onHover={onHover}
              hovered={hovered}
              getColor={rankMap}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default VizPanel;
