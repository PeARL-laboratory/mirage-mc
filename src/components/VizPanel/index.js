import SongListDetail from "../SongListDetail";
import React, {useState} from "react";
import {Grid, MenuItem, TextField} from "@mui/material";
import Histogram from "./Histogram";

export default function ({countries}) {
    const [source,setSource] = useState("event");
    return <Grid container sx={{position:'relative',height:'100%'}}>
        <Grid item xs={4}>
            <SongListDetail countries={countries}/>
        </Grid>
        <Grid item xs={8}>
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        id="viz-selection-source"
                        select
                        label="Viz source"
                        value={source}
                        variant="standard"
                        fullWidth
                        onChange={(event) => {
                            setSource(event.target.value);
                    }}
                    >
                        <MenuItem value="event">Event list</MenuItem>
                        <MenuItem value="selected">Selected list</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <Histogram name="aa" data={[1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]}/>
                </Grid>
                <Grid item xs={6}>

                </Grid>
            </Grid>
        </Grid>
    </Grid>
}