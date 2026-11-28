const COUNTY_GEOJSON_URL = "https://services1.arcgis.com/YBWrN5qiESVpqi92/arcgis/rest/services/ncgs_state_county_boundary/FeatureServer/0/query?where=1%3D1&outFields=County,FIPS&returnGeometry=true&outSR=4326&f=geojson";

let countyGeometryPromise;

export function normalizeCountyMapName(value = "") {
  return String(value).toLowerCase().replace(/\\s+county$/i, "").replace(/[^a-z0-9]/g, "");
}

export function getCountyGeometryCollection() {
  if (!countyGeometryPromise) {
    countyGeometryPromise = fetch(COUNTY_GEOJSON_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`County boundary service returned ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.features) || data.features.length < 95) {
          throw new Error("The county boundary service did not return the expected statewide county set.");
        }
        return data;
      })
      .catch((error) => {
        countyGeometryPromise = null;
        throw error;
      });
  }
  return countyGeometryPromise;
}

export function getCountyFeatureMap(collection) {
  return new Map((collection?.features || []).map((feature) => [
    normalizeCountyMapName(feature.properties?.County),
    feature
  ]));
}

function geometryRings(feature) {
  const geometry = feature?.geometry;
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates || [];
  if (geometry.type === "MultiPolygon") return (geometry.coordinates || []).flat();
  return [];
}

function makeProjector(features, width, height, padding) {
  const points = features.flatMap((feature) => geometryRings(feature).flat());
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY));
  const drawnWidth = (maxX - minX) * scale;
  const drawnHeight = (maxY - minY) * scale;
  const offsetX = (width - drawnWidth) / 2;
  const offsetY = (height - drawnHeight) / 2;
  return ([lon, lat]) => [
    offsetX + (lon - minX) * scale,
    height - offsetY - (lat - minY) * scale
  ];
}

export function countyFeaturePath(feature, width = 160, height = 100, padding = 7) {
  if (!feature) return "";
  const project = makeProjector([feature], width, height, padding);
  return geometryRings(feature).map((ring) => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + " Z").join(" ");
}

export function countyCollectionPaths(collection, width = 900, height = 500, padding = 10) {
  const features = collection?.features || [];
  if (!features.length) return [];
  const project = makeProjector(features, width, height, padding);
  return features.map((feature) => ({
    feature,
    name: feature.properties?.County || "County",
    fips: feature.properties?.FIPS || "",
    d: geometryRings(feature).map((ring) => ring.map((point, index) => {
      const [x, y] = project(point);
      return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ") + " Z").join(" ")
  }));
}
