import json
import math

SRC = 'japan.simplified.geojson'
OUT = '../src/data/geo/japanPaths.ts'

with open(SRC, encoding="utf-8") as f:
    data = json.load(f)

# Okinawa is geographically far south/west of the mainland; render it in a
# separate inset box (standard practice for Japan maps) so the mainland
# doesn't get squeezed to fit a tiny southern dot on screen.
OKINAWA_ID = 47

# Remote outlying islands (Ogasawara/Iwo-Jima for Tokyo, Amami group for
# Kagoshima, etc.) sit far south of their prefecture's main landmass and
# would otherwise force the whole-Japan projection to shrink dramatically.
# Any ring whose entire latitude range sits below this threshold is a
# remote outlying island and is dropped from the *main* map projection's
# bounding-box calculation and rendering. Okinawa itself is handled via a
# separate inset projection below, not this threshold.
REMOTE_ISLAND_LAT_THRESHOLD = 28.5

MAIN_VIEW_W = 620
MAIN_VIEW_H = 900
MAIN_PAD = 18

INSET_VIEW_W = 150
INSET_VIEW_H = 110
INSET_PAD = 8

OKINAWA_LON_RANGE = (122.8, 128.9)
OKINAWA_LAT_RANGE = (23.9, 27.1)

CENTER_LAT_RAD = math.radians(36.0)
COS_CENTER = math.cos(CENTER_LAT_RAD)


def ring_bbox(ring):
    lons = [p[0] for p in ring]
    lats = [p[1] for p in ring]
    return min(lons), min(lats), max(lons), max(lats)


def polygons_from_geometry(geometry):
    gtype = geometry["type"]
    coords = geometry["coordinates"]
    if gtype == "Polygon":
        return [coords]
    if gtype == "MultiPolygon":
        return coords
    raise ValueError(f"unexpected geometry type {gtype}")


def is_remote_island_ring(ring):
    _, _, _, max_lat = ring_bbox(ring)
    return max_lat < REMOTE_ISLAND_LAT_THRESHOLD


# --- Pass 1: filter out remote outlying islands from every non-Okinawa
# prefecture, and compute the main map's lon/lat bounding box from what's
# left (Hokkaido through Kyushu's main bodies).
filtered_polygons_by_id = {}
main_lons = []
main_lats = []

for feature in data["features"]:
    pid = feature["properties"]["id"]
    polygons = polygons_from_geometry(feature["geometry"])
    if pid == OKINAWA_ID:
        filtered_polygons_by_id[pid] = polygons
        continue
    kept_polygons = []
    for polygon in polygons:
        kept_rings = [ring for ring in polygon if not is_remote_island_ring(ring)]
        if kept_rings:
            kept_polygons.append(kept_rings)
            for ring in kept_rings:
                for lon, lat in ring:
                    main_lons.append(lon)
                    main_lats.append(lat)
    filtered_polygons_by_id[pid] = kept_polygons

MAIN_LON_RANGE = (min(main_lons), max(main_lons))
MAIN_LAT_RANGE = (min(main_lats), max(main_lats))


def make_projector(lon_range, lat_range, view_w, view_h, pad):
    lon0, lon1 = lon_range
    lat0, lat1 = lat_range
    span_x = (lon1 - lon0) * COS_CENTER
    span_y = (lat1 - lat0)
    avail_w = view_w - 2 * pad
    avail_h = view_h - 2 * pad
    scale = min(avail_w / span_x, avail_h / span_y)
    proj_w = span_x * scale
    proj_h = span_y * scale
    offset_x = pad + (avail_w - proj_w) / 2
    offset_y = pad + (avail_h - proj_h) / 2

    def project(lon, lat):
        x = (lon - lon0) * COS_CENTER * scale + offset_x
        y = (lat1 - lat) * scale + offset_y
        return x, y

    return project


project_main = make_projector(MAIN_LON_RANGE, MAIN_LAT_RANGE, MAIN_VIEW_W, MAIN_VIEW_H, MAIN_PAD)
project_okinawa = make_projector(OKINAWA_LON_RANGE, OKINAWA_LAT_RANGE, INSET_VIEW_W, INSET_VIEW_H, INSET_PAD)


def ring_to_path(ring, project):
    parts = []
    for i, (lon, lat) in enumerate(ring):
        x, y = project(lon, lat)
        x = round(x, 2)
        y = round(y, 2)
        parts.append(f"{'M' if i == 0 else 'L'}{x},{y}")
    parts.append("Z")
    return "".join(parts)


def polygons_to_path(polygons, project):
    parts = []
    for polygon in polygons:
        for ring in polygon:
            parts.append(ring_to_path(ring, project))
    return "".join(parts)


def polygons_projected_bbox(polygons, project):
    xs = []
    ys = []
    for polygon in polygons:
        for ring in polygon:
            for lon, lat in ring:
                x, y = project(lon, lat)
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


entries = []
for feature in data["features"]:
    props = feature["properties"]
    pid = props["id"]
    name_ja = props["nam_ja"]
    polygons = filtered_polygons_by_id[pid]
    project = project_okinawa if pid == OKINAWA_ID else project_main
    path = polygons_to_path(polygons, project)
    bbox = polygons_projected_bbox(polygons, project)
    entries.append((pid, name_ja, path, bbox))

entries.sort(key=lambda e: e[0])

lines = []
lines.append("// Auto-generated from dataofjapan/land (japan.geojson), simplified with mapshaper")
lines.append("// and projected to SVG path data. Do not hand-edit; regenerate via scripts/build-map-paths.py.")
lines.append("")
lines.append("export interface PrefecturePathDatum {")
lines.append("  /** Standard JIS prefecture code, 1 (Hokkaido) - 47 (Okinawa) */")
lines.append("  jisCode: number;")
lines.append("  nameJa: string;")
lines.append("  /** SVG path `d` attribute, in the map's own local viewBox coordinate space */")
lines.append("  path: string;")
lines.append("  /** [minX, minY, maxX, maxY] of this prefecture, same coordinate space as `path` */")
lines.append("  bbox: [number, number, number, number];")
lines.append("  /** true for prefectures rendered in the separate Okinawa inset box */")
lines.append("  inset: boolean;")
lines.append("}")
lines.append("")
lines.append(f"export const MAIN_MAP_VIEWBOX = '0 0 {MAIN_VIEW_W} {MAIN_VIEW_H}';")
lines.append(f"export const OKINAWA_INSET_VIEWBOX = '0 0 {INSET_VIEW_W} {INSET_VIEW_H}';")
lines.append(f"export const MAIN_MAP_BBOX: [number, number, number, number] = [0, 0, {MAIN_VIEW_W}, {MAIN_VIEW_H}];")
lines.append(f"export const OKINAWA_INSET_BBOX: [number, number, number, number] = [0, 0, {INSET_VIEW_W}, {INSET_VIEW_H}];")
lines.append("")
lines.append("export const PREFECTURE_PATHS: PrefecturePathDatum[] = [")
for pid, name_ja, path, bbox in entries:
    inset = "true" if pid == OKINAWA_ID else "false"
    bx = ", ".join(f"{v:.2f}" for v in bbox)
    lines.append("  {")
    lines.append(f"    jisCode: {pid},")
    lines.append(f"    nameJa: '{name_ja}',")
    lines.append(f"    path: '{path}',")
    lines.append(f"    bbox: [{bx}],")
    lines.append(f"    inset: {inset},")
    lines.append("  },")
lines.append("];")
lines.append("")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("wrote", OUT, "with", len(entries), "entries")
print("main lon range", MAIN_LON_RANGE, "lat range", MAIN_LAT_RANGE)
