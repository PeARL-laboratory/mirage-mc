import Plot from 'react-plotly.js';
import {useTheme} from "@mui/material/styles";
import {useEffect, useState, useMemo} from "react";

export default function  RadarChart ({inputData,axisInfo,height,width,highlight}) {
    const theme = useTheme();
    let [data,setData] = useState([]);
    useEffect(()=>{
        if (axisInfo.length && inputData.length) {
            const data = inputData.map(d => {
                const item = {
                    type: 'scatterpolar',
                    r: [],
                    theta: [],
                    fill: 'toself'
                };
                axisInfo.forEach((k, ki) => {
                    item.r[ki] = d[k.key] ?? undefined;
                    item.theta[ki] = k.label;
                })
                item.r.push(item.r[0]);
                item.theta.push(item.theta[0]);
                return item;
            });
            setData(data);
        }else{
            setData([]);
        }
    },[inputData,axisInfo])
    let layout = useMemo(()=>({
        paper_bgcolor: 'rgba(255,255,255,0)',
        plot_bgcolor:'rgba(255,255,255,0)',
        autoscale: false,
        height:height,
        width:width,
        margin:{t:40,r:20,l:20,b:40},
        font: {
            family: theme.typography.fontFamily,
            size: theme.typography.fontSize,
            color: theme.palette.text.primary
        },
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1]
            }
        },
        showlegend: false
    }),[height,width,theme]);
    return (
        <Plot
            data={data}
            layout={ layout }
            config = {{'displaylogo': false,
                'toImageButtonOptions': {
                    'format': 'svg',//one of png, svg, jpeg, webp 'svg'
                    'filename': 'Station_Map',
                    'height': 1080,
                    'width': 1920,
                    'scale': 1// # Multiply title/legend/axis/canvas sizes by this factor
                },
                showEditInChartStudio: true,
                plotlyServerURL: "https://chart-studio.plotly.com",
                // '#Station':false
            }}
        />
    );
}