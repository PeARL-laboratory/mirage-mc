import {
  Grid,
  MenuItem,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { PCA } from "ml-pca";
import Scatterplot from "../Scatterplot";
import AutoSizer from "lp-react-virtualized-auto-sizer-react-18";

function PCAplot({ data, selectList, onSelect, onHover, hovered, getColor }) {
  const [axis, setAxis] = useState(selectList.map((d) => d.key));
  const [scatterdata, setScatterdata] = useState({ x: [], y: [], data: [] });
  const [highlight, sethighlight] = useState({ x: [], y: [], data: [] });
  const [pcaob, setpcaob] = useState();
  const [color, setcolor] = useState([]);
  const selectListMap = useMemo(() => {
    const m = {};
    selectList.forEach((d) => {
      m[d.key] = d;
    });
    return m;
  }, [selectList]);
  useEffect(() => {
    const dataMatrix = [];
    const dataValid = [];
    try {
      data.forEach((d) => {
        let valid = true;
        const m = [];
        axis.forEach((key) => {
          if (isNaN(d[key])) valid = false;
          else m.push(d[key]);
        });
        if (valid) {
          dataMatrix.push(m);
          dataValid.push(d);
        }
      });

      const pca = new PCA(dataMatrix);
      const result = pca.predict(dataMatrix);
      // PCA 2 comp
      const principalComponent1 = result.data.map((row) => row[0]);
      const principalComponent2 = result.data.map((row) => row[1]);

      const explain = pca.getExplainedVariance();
      const scatterdata = {
        x: principalComponent1,
        y: principalComponent2,
        data: dataValid,
        xname: `PC1 (${Math.round(explain[0] * 1000) / 10}%)`,
        yname: `PC2 (${Math.round(explain[1] * 1000) / 10}%)`,
      };
      setpcaob(pca);
      setScatterdata(scatterdata);
    } catch (e) {
      setScatterdata({ x: [], y: [], data: [], xname: "PC1", yname: "PC2" });
      setpcaob(null);
    }
  }, [data, axis]);
  useEffect(() => {
    setcolor(scatterdata.data.map((row) => getColor.getColor(row)));
  }, [scatterdata.data, getColor]);
  useEffect(() => {
    if (hovered && pcaob)
      try {
        debugger;
        const m = [];
        let valid = true;
        axis.forEach((key) => {
          if (isNaN(hovered[key])) valid = false;
          else m.push(hovered[key]);
        });
        if (valid) {
          const p = pcaob.predict([m]);
          sethighlight({
            x: [p.data[0][0]],
            y: [p.data[0][1]],
            data: [hovered],
          });
        } else {
          throw Error("Hover point invalid");
        }
      } catch (e) {
        sethighlight({ x: [], y: [], data: [] });
      }
    else sethighlight({ x: [], y: [], data: [] });
  }, [axis, hovered, pcaob]);
  return (
    <Grid
      container
      direction={"column"}
      sx={{ position: "relative", width: "100%" }}
    >
      <Grid item>
        <FormControl sx={{ m: 1, mb: 0, maxWidth: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>

          <Select
            id="viz-selection-pca"
            multiple
            value={axis}
            input={<OutlinedInput label="PCA axis" size="small" />}
            renderValue={(selected) =>
              selected.map((d) => selectListMap[d]?.label).join(", ")
            }
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              setAxis(typeof value === "string" ? value.split(",") : value);
            }}
          >
            {selectList.map(({ key, label }) => (
              <MenuItem key={`pca-s-${key}`} value={key}>
                <Checkbox checked={axis.indexOf(key) > -1} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ position: "relative" }}>
        <AutoSizer style={{ height: "100%", width: "100%" }} disableHeight>
          {({ height, width }) => {
            return (
              <Scatterplot
                data={scatterdata}
                xname={scatterdata.xname}
                yname={scatterdata.yname}
                color={color}
                width={width}
                height={width}
                onSelect={onSelect}
                onHover={onHover}
                hovered={highlight}
              />
            );
          }}
        </AutoSizer>
      </Grid>
    </Grid>
  );
}
export default PCAplot;
