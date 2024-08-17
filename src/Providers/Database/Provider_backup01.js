import React, { useCallback, useEffect, useReducer } from "react";
import Context from "./Context";
import {
  groups as d3groups,
  sum as d3sum,
  mean as d3mean,
  csv as d3csv,
} from "d3";
import full_countries from "./data/mirage-mc-v1.countries.json";
import full_location from "./data/mirage-mc-v1.locs.json";
import axios from "axios";
import lzString from "lz-string";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, selectFilters } from "../../reducer/streamfilters";
import { actionCreators } from "../../reducer/actions/selectedList";
import exportVariable from "./data/MIRAGE_exportvariables.csv";
// import location from "./data/location.json";

const APIKey = process.env.REACT_APP_DATA_API;
const APIUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DATA_URL
    : process.env.REACT_APP_DATA_URL_LOCAL;
const HOMEURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DATA_HOMEPAGE
    : process.env.REACT_APP_DATA_HOMEPAGE_LOCAL;

axios.defaults.headers.common = {
  "api-key": APIKey,
};

const emptyArray = [];

function reducer(state, action) {
  const {
    type,
    path,
    isLoading = false,
    error = false,
    hasError = false,
    value,
  } = action;
  switch (type) {
    case "LOADING_CHANGED":
      return { ...state, [path]: { ...state[path], isLoading } };
    case "VALUE_CHANGE":
      return {
        ...state,
        [path]: { ...state[path], value, isLoading, error, hasError },
      };
    case "INIT":
      return { ...state, isInit: value };
    default:
      console.log(type);
      return state;
    // throw new Error()
  }
}

const init = {
  fields: { value: { stationData: [], locationData: [] } },
  locs: {},
  countries: {},
  locs_full: { value: full_location },
  countries_full: { value: full_countries },
  events: {},
  vizdata: {},
  event_export_list: { value: {} },
  loading: false,
  error: false,
  isInit: false,
};

const emptyFunc = () => {};
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  const filters = useSelector(selectFilters);
  const eventSelectedData = useSelector((state) =>
    Array.from(state.seletedList.items.values())
  );
  const dispatchEvent = useDispatch();
  useEffect(() => {
    const controllerS = new AbortController();
    const controllerL = new AbortController();

    try {
      console.time("Load and process data");
      console.time("-Load data-");
      // dispatch({type: 'LOADING_CHANGED', path: 'rawData', isLoading: true});
      dispatch({ type: "LOADING_CHANGED", path: "locs", isLoading: true });
      dispatch({ type: "LOADING_CHANGED", path: "countries", isLoading: true });
      dispatch({ type: "LOADING_CHANGED", path: "fields", isLoading: true });
      dispatch({
        type: "LOADING_CHANGED",
        path: "event_export_list",
        isLoading: true,
      }); // for export
      // load data
      Promise.all([
        axios
          .get(`${APIUrl}/station/city`, {
            signal: controllerS.signal,
          })
          .then(({ data }) => {
            return data;
          }),
        // axios.get(`${APIUrl}/station/country/`,{
        //     signal: controllerL.signal
        // }).then(({data})=>data),
        axios
          .get(`${APIUrl}/station/fields/`, {
            signal: controllerL.signal,
          })
          .then(({ data }) => data),
        axios
          .get(`${APIUrl}/location/fields/`, {
            signal: controllerL.signal,
          })
          .then(({ data }) => data),
        axios
          .get(`${APIUrl}/location/`, {
            signal: controllerL.signal,
          })
          .then(({ data }) => data),
        // ]).then(([locs, countries,stationFields,locationFields]) => {
      ]).then(([_city, stationFields, locationFields, locationData]) => {
        console.timeEnd("-Load data-");
        const byLocName = {};
        locationData.forEach((d) => {
          // d.lat = (+d.Location_RG_Longitude);
          // d.long = (+d.Location_RG_Latitude);
          d.long = +d.Location_RG_Longitude;
          d.lat = +d.Location_RG_Latitude;
          delete d.Location_RG_Longitude;
          delete d.Location_RG_Latitude;
          byLocName[d["Location_RG_ID"]] = d;
        });
        const locs = _city.map((d) => {
          const locinfo = byLocName[d._id] ?? {};
          return {
            ...locinfo,
            title: `${locinfo.Location_RG_City} - ${locinfo.Location_RG_Country}`,
            count: d.count,
          };
        });
        const countries = d3groups(locs, (d) => d["Location_RG_Country"]).map(
          (d) => {
            return {
              title: d[0],
              long: d3mean(d[1], (e) => e.long),
              lat: d3mean(d[1], (e) => e.lat),
              count: d3sum(d[1], (e) => e.count),
              // values: d[1]
            };
          }
        );
        // console.time('-Correct data-');
        // const locationDataMap = {};
        // locationData.forEach(d => {
        //     d.lat = (+d.Location_RG_Longitude);
        //     d.long = (+d.Location_RG_Latitude);
        //     delete d.Location_RG_Longitude;
        //     delete d.Location_RG_Latitude;
        //     locationDataMap[d['Location_RG_ID']] = d;
        // });
        // let stationDataMap = {};
        // stationData.forEach(d => {
        //     d.lat = locationDataMap[d['Location_RG_ID']].lat;
        //     d.long = locationDataMap[d['Location_RG_ID']].long;
        //     d.Location_RG_Country = locationDataMap[d['Location_RG_ID']].Location_RG_Country;
        //     d.Location_RG_City = locationDataMap[d['Location_RG_ID']].Location_RG_City;
        //     stationDataMap[d['Station_RG_ID']] = d;
        // });
        // const rawData = {stationData, locationData,stationDataMap,locationDataMap};
        // dispatch({type: 'VALUE_CHANGE', path: 'rawData', value: rawData, isLoading: false,});
        // console.timeEnd('-Correct data-');
        // console.time('-filterdata-');
        // const {locs, countries} = handleData(rawData);
        const fields = { ...stationFields, ...locationFields };
        // console.log(fields.Location_RG_City)
        // Object.keys(fields).forEach(k=>fields[k].sort())
        countries.sort((a, b) => b.count - a.count);
        locs.sort((a, b) => b.count - a.count);

        dispatch({
          type: "VALUE_CHANGE",
          path: "locs",
          value: locs,
          isLoading: false,
        });
        dispatch({
          type: "VALUE_CHANGE",
          path: "countries",
          value: countries,
          isLoading: false,
        });
        dispatch({
          type: "VALUE_CHANGE",
          path: "fields",
          value: fields,
          isLoading: false,
        });
        // console.timeEnd('-filterdata-');
        console.timeEnd("Load and process data");
      });
      // load export list
      d3csv(exportVariable).then((data) => {
        const event_export_list = {};
        data.forEach((d) => {
          if (d["export?"] === "Y") event_export_list[d["new_fields"]] = true;
        });
        dispatch({
          type: "VALUE_CHANGE",
          path: "event_export_list",
          value: event_export_list,
          isLoading: false,
        });
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        path: "locs",
        isLoading: false,
        error,
        hasError: true,
      });
      dispatch({
        type: "ERROR",
        path: "countries",
        isLoading: false,
        error,
        hasError: true,
      });
      dispatch({
        type: "ERROR",
        path: "fields",
        isLoading: false,
        error,
        hasError: true,
      });
    }
    return () => {
      console.log("destroy!!!");
      controllerS.abort();
      controllerL.abort();
    };
  }, []);

  const getListError = useCallback(
    (path) => {
      return state[path] ? state[path].error : false;
    },
    [state]
  );
  const getList = useCallback(
    (path) => {
      return state[path] && state[path].value ? state[path].value : [];
    },
    [state]
  );

  // get list of field
  const getDistinctField = useCallback(
    (field) => {
      return state.fields && state.fields.value[field]
        ? state.fields.value[field]
        : [];
    },
    [state]
  );
  const searchByStream = (path, query, cat = "stream") => {
    dispatch({
      type: "LOADING_CHANGED",
      path: `search-${path}`,
      isLoading: true,
    });
    return axios
      .post(`${APIUrl}/${cat}/search`, { [path]: query })
      .then(({ data }) => {
        dispatch({
          type: "VALUE_CHANGE",
          path: `search-${path}`,
          value: data.map((d) => d._id),
          isLoading: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: "ERROR",
          path: `search-${path}`,
          isLoading: false,
          error,
          hasError: true,
        });
      });
  };
  const getEvents = useCallback(() => {
    return state.events && state.events.value ? state.events.value : emptyArray;
  }, [state.events.value]);
  const requestVizdata = useCallback(
    (id) => {
      dispatch({ type: "LOADING_CHANGED", path: "vizdata", isLoading: true });
      let query = {
        id,
        viz: true,
        headers: {
          "Accept-Encoding": "gzip",
        },
      };
      axios
        .post(`${APIUrl}/meta/`, query)
        .then(({ data }) => {
          dispatch({
            type: "VALUE_CHANGE",
            path: "vizdata",
            value: data ?? [],
            isLoading: false,
          });
        })
        .catch((error) => {
          dispatch({
            type: "ERROR",
            path: `vizdata`,
            isLoading: false,
            error,
            hasError: true,
          });
        });
    },
    [state]
  );
  const requestEvents = useCallback(
    (filter, limit, isid) => {
      dispatch({ type: "LOADING_CHANGED", path: "events", isLoading: true });
      let query = {
        filter,
        headers: {
          "Accept-Encoding": "gzip",
        },
      };
      if (isid)
        query = {
          id: filter,
          headers: {
            "Accept-Encoding": "gzip",
          },
        };
      axios
        .post(`${APIUrl}/meta/`, query)
        .then(({ data }) => {
          dispatch({
            type: "VALUE_CHANGE",
            path: "events",
            value: data ?? [],
            isLoading: false,
          });
        })
        .catch((error) => {
          dispatch({
            type: "ERROR",
            path: `events`,
            isLoading: false,
            error,
            hasError: true,
          });
        });
    },
    [state]
  );
  const requestDetail = useCallback(
    (data) => {
      dispatch({ type: "LOADING_CHANGED", path: "detail", isLoading: true });
      axios
        .get(`${APIUrl}/meta/${data._id}`)
        .then(({ data }) => {
          // flat data
          if (data) {
            ["stream_info", "location_info", "station_info"].forEach((k) => {
              Object.keys(data[k]).forEach((subk) =>
                subk !== "_id" ? (data[subk] = data[k][subk]) : null
              );
              delete data[k];
            });
            // data.lat = data.Location_RG_Longitude;
            // data.long = data.Location_RG_Latitude;
            data.long = data.Location_RG_Longitude;
            data.lat = data.Location_RG_Latitude;
            delete data.Location_RG_Longitude;
            delete data.Location_RG_Latitude;
            dispatch({
              type: "VALUE_CHANGE",
              path: "detail",
              value: data,
              isLoading: false,
            });
          } else {
            dispatch({
              type: "ERROR",
              path: `detail`,
              isLoading: false,
              error: "Not found",
              hasError: true,
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: "ERROR",
            path: `detail`,
            isLoading: false,
            error,
            hasError: true,
          });
        });
    },
    [state]
  );
  const getDetail = useCallback(() => {
    return state.detail && state.detail.value ? state.detail.value : null;
  }, [state]);
  function getExtra(r, stationDataMap, locationDataMap, streamDetail) {
    return {
      ...r,
      Station_SE_Description:
        stationDataMap[r["Station_RG_ID"]].Station_SE_Description,
      Station_SE_WebsiteURL:
        stationDataMap[r["Station_RG_ID"]].Station_SE_WebsiteURL,
      lat: locationDataMap[r["Location_RG_ID"]].lat,
      long: locationDataMap[r["Location_RG_ID"]].long,
      Station_RG_URL: stationDataMap[r["Station_RG_ID"]].Station_RG_URL,
      // Track_SP_Name:streamDetail[r['Event_MA_ID']].Track_SP_Name,
      ...streamDetail[r["Event_MA_ID"]],
    };
  }
  const getDownloadData = useCallback(
    (listids) => {
      return axios
        .post(`${APIUrl}/meta/`, {
          id: listids.map((d) => d._id),
          download: true,
        })
        .then(({ data }) => {
          return data;
        });
    },
    [state]
  );

  const getShortenLink = useCallback(() => {
    // get filter, ID and seleted event
    const _data = {
      filters,
      ids: eventSelectedData.map((d) => d._id),
      id: getDetail(),
    };
    const compressed = lzString.compressToEncodedURIComponent(
      JSON.stringify(_data)
    );
    return axios
      .post(`${APIUrl}/url/`, { data: compressed })
      .then(({ data }) => {
        return HOMEURL + "?selected=" + data._id;
      });
  }, [state, filters, eventSelectedData]);

  const getDataFromShortenLink = useCallback(
    (id) => {
      return axios.get(`${APIUrl}/url/${id}`).then(({ data }) => {
        if (data && data.data) {
          try {
            let _data = lzString.decompressFromEncodedURIComponent(data.data);
            _data = JSON.parse(_data);
            dispatchEvent(setFilters({ value: _data.filters }));
            if (_data.id) requestDetail(_data.id);
            requestEvents(_data.filters, 1000);
            axios
              .post(`${APIUrl}/meta/`, { id: _data.ids })
              .then(({ data }) => {
                dispatchEvent(actionCreators.addsToBasket(data));
              });
          } catch (e) {
            return null;
          }
        } else return null;
      });
    },
    [state]
  );

  const setFuncCollection = useCallback(
    (path, func = emptyFunc) => {
      dispatch({ type: "VALUE_CHANGE", path, value: func, isLoading: false });
    },
    [state]
  );

  const getFuncCollection = useCallback(
    (path) => {
      return state[path] && state[path].value ? state[path].value : emptyFunc;
    },
    [state]
  );

  const isLoading = useCallback(
    (path) => {
      return state[path] ? state[path].isLoading : false;
    },
    [state]
  );
  return (
    <Context.Provider
      value={{
        getList,
        getEvents,
        requestEvents,
        requestVizdata,
        getDistinctField,
        searchByStream,
        setFuncCollection,
        getFuncCollection,
        getDetail,
        requestDetail,
        getListError,
        getDownloadData,
        getShortenLink,
        getDataFromShortenLink,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;