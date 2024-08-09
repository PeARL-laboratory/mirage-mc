import React, { useEffect, useMemo, useState } from "react";
import { Card, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { scaleLinear, extent } from "d3";
export default function Barchart({ data, fullHeight }) {
  const widthScale = useMemo(() => {
    return scaleLinear()
      .range([0.1, 1])
      .domain(
        extent(data, (d) => {
          return d?.count;
        })
      );
  }, [data]);

  return (
    <Grid container>
      <Grid item sx={{ maxWidth: 300, textAlign: "right" }}>
        <Stack
          m={1}
          sx={{
            maxHeight: fullHeight ? null : "30vh",
            overflowY: "auto",
          }}
        >
          {data.map((d) => (
            <Typography key={d["title"]} variant={"subtitle2"}>
              {d["title"]}
            </Typography>
          ))}
        </Stack>
      </Grid>
      <Grid item flexGrow={2}>
        <Stack
          m={1}
          sx={{
            maxHeight: fullHeight ? null : "30vh",
            overflowY: "auto",
          }}
        >
          {data.map((d) => (
            <Typography key={d["title"]} variant={"subtitle2"}>
              <div
                style={{
                  width: `${80 * (widthScale(d.count) ?? 1)}%`,
                  height: 10,
                  backgroundColor: d.color,
                  display: "inline-block",
                  marginRight: 5,
                }}
              ></div>
              {d.count}
            </Typography>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
