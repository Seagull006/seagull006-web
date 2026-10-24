"""Make a province-wide GeoJSON of BC BEC zones from the BC government.

The ArcGIS service sends at most 1,000 features per request. We first retrieve
all feature IDs, request their geometries in smaller batches, then dissolve
polygons by BEC zone. This preserves the 16 thematic categories while removing
boundaries between adjacent polygons of the same category.
"""
import json
import time
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from shapely.geometry import mapping, shape
from shapely.ops import unary_union

SERVICE = "https://delivery.maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgwpub/MapServer/672/query"
OUTPUT = Path(__file__).resolve().parents[1] / "bc_bec_zones.geojson"


def ask(params):
    url = SERVICE + "?" + urlencode(params)
    for attempt in range(4):
        try:
            request = Request(url, headers={"User-Agent": "UBC-cartography-class-educational-BEC-atlas/1.0"})
            with urlopen(request, timeout=120) as reply:
                data = json.load(reply)
            if "error" in data:
                raise ValueError(str(data["error"]))
            return data
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))


print("Requesting the list of all BEC polygons...")
info = ask({"where": "1=1", "returnIdsOnly": "true", "f": "json"})
ids = sorted(info.get("objectIds") or [])
if not ids:
    raise RuntimeError("The government server did not return any IDs")
print(f"Official layer has {len(ids):,} records; collecting in batches of 150.")

zones = defaultdict(list)
names = {}
seen = set()
for start in range(0, len(ids), 150):
    batch = ids[start:start + 150]
    result = ask({
        "objectIds": ",".join(map(str, batch)),
        "outFields": "OBJECTID,ZONE,ZONE_NAME",
        "returnGeometry": "true",
        "outSR": "4326",
        "f": "geojson",
    })
    features = result.get("features")
    if not isinstance(features, list) or len(features) != len(batch):
        raise RuntimeError(f"Missing records in batch {start}; received {len(features or [])} of {len(batch)}")
    if result.get("exceededTransferLimit"):
        raise RuntimeError(f"The server truncated batch {start}")
    for feature in features:
        props = feature["properties"]
        oid = props.get("OBJECTID", feature.get("id"))
        if oid is None or oid in seen:
            raise RuntimeError(f"Missing or repeated object ID: {oid}")
        seen.add(oid)
        code = props.get("ZONE")
        if not code or not feature.get("geometry"):
            raise RuntimeError(f"Missing zone or geometry for ID {oid}")
        zones[code].append(shape(feature["geometry"]))
        names[code] = props.get("ZONE_NAME", code)
    print(f"Downloaded {len(seen):,}/{len(ids):,} polygons")
    time.sleep(0.15)

if seen != set(ids):
    raise RuntimeError("Some object IDs were missing; not publishing an incomplete map")

print(f"Dissolving source polygons into {len(zones)} BEC zone categories...")
features = []
for code in sorted(zones):
    polygon = unary_union(zones[code])
    # The government's source is already generalized to 1:2 million.
    # A mild additional simplification in WGS84 degrees reduces file size,
    # while keeping disconnected ecosystems as separate polygon parts.
    polygon = polygon.simplify(0.002, preserve_topology=True)
    if polygon.is_empty:
        raise RuntimeError(f"Empty geometry for {code}")
    features.append({"type": "Feature", "properties": {"ZONE": code, "ZONE_NAME": names[code]}, "geometry": mapping(polygon)})

collection = {"type": "FeatureCollection", "features": features}
OUTPUT.write_text(json.dumps(collection, separators=(",", ":")), encoding="utf-8")
print(f"Saved {len(features)} BEC zone features, {OUTPUT.stat().st_size / 1048576:.2f} MiB to {OUTPUT}")
