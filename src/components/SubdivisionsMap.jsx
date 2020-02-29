import React, { Fragment } from 'react';
import { get, isEmpty, sample } from "lodash";
import { Map as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet'
import { GeoJSONFillable } from 'react-leaflet-geojson-patterns';
import { observer } from 'mobx-react-lite';
import ColorScheme from 'color-scheme';

import { useStores } from '../stores';

import './SubdivisionsMap.scss';

function onEachFeature(feature, layer) {
  const namePoint = get(feature, 'properties.relations[0].reltags.name', null)
  const namePolygon = get(feature, 'properties.tags.name', null)

  if (namePoint) {
    layer.bindPopup(`${namePoint}`);
  }

  if (namePolygon) {
    layer.bindPopup(`${namePolygon}`);
  }
}

function onStyle(colors, feature) {
  return {
    color: `#${sample(colors)}`,
    opacity: 1,
    fillOpacity: 0.4,
    weight: 1,
  };
}

const GeoJSONLayers = ({ data = [] }) => {
  if (isEmpty(data)) {
    return null;
  }

  const rand = Math.random();

  const scheme = new ColorScheme();
  scheme
    .from_hue(180)
    .distance(0.7)
    .scheme('tetrade')   
    .variation('soft')
    .web_safe(true);

  const colors = scheme.colors();

  return <Fragment>
    {
      data.map((v, i) => {
        if (!isEmpty(v)) {
          return <GeoJSONFillable data={v} key={`geojson-${rand}-${i}`} onEachFeature={onEachFeature} style={onStyle.bind(this, colors)}/>
        }

        return null;
      }).filter(e => !!e)
    }
  </Fragment>;
}

const SubdivisionsMap = observer(() => {
  const { subdivisions } = useStores();
  return (
    <Fragment>
      <LeafletMap animate={true} center={[50, 20]} maxZoom={18} zoom={12} className="SubdivisionsMap" zoomControl={false} dragging={true} bounds={subdivisions.bounds}>
        <TileLayer
          attribution='<a href="https://michal.kruczek.it" target="_blank">znajdzosiedle.pl</a>&nbsp;&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomleft" />
        <GeoJSONLayers data={subdivisions.subdivisions}/>
      </LeafletMap>
    </Fragment>
  )
});

export default SubdivisionsMap;
