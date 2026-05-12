#!/usr/bin/env python3
# Copyright (c) 2025 HQC System Contributors
# Licensed under the GNU General Public License v3.0 (GPL-3.0)

"""
Sync Hanoi OSM data from Overpass API (Real-time fetching)
Does not require local PBF files or osmium tool.
"""

import sys
import os
import requests
import asyncio
import json
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.config import settings

OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

HANOI_QUERY = """
[out:json][timeout:180];
(
  // Find Hanoi administrative area first (supports both vi/en names)
  area["boundary"="administrative"]["admin_level"="4"]["name"~"Hà Nội|Ha Noi|Hanoi"];
)->.hn;

(
  // City boundary + ward/commune level boundaries in Hanoi area
  relation(area.hn)["boundary"="administrative"]["admin_level"~"^(4|6)$"];
);
out tags bb;
"""

async def sync_hanoi_osm():
    print("🌍 Fetching real Hanoi OSM data from Overpass API...")
    
    data = None
    headers = {
        "User-Agent": "HQC-System-Hanoi-Sync/1.0 (+https://littlefish.website)",
        "Accept": "application/json",
    }

    for endpoint in OVERPASS_ENDPOINTS:
        try:
            print(f"  → Requesting Overpass endpoint: {endpoint}")
            response = requests.post(
                endpoint,
                data={"data": HANOI_QUERY},
                headers=headers,
                timeout=120,
            )
            response.raise_for_status()
            data = response.json()
            print(f"  ✓ Overpass success: {endpoint}")
            break
        except Exception as e:
            print(f"  ✗ Endpoint failed: {endpoint} -> {e}")

    if data is None:
        print("❌ Failed to fetch data from all Overpass endpoints.")
        return

    elements = data.get('elements', [])
    print(f"✓ Found {len(elements)} administrative boundaries.")

    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    
    async with engine.begin() as conn:
        for el in elements:
            osm_id = el.get('id')
            tags = el.get('tags', {})
            name = tags.get('name', tags.get('name:vi', 'Không tên'))
            admin_level = int(tags.get('admin_level', 6))
            
            # Simplified geometry for demonstration (using bounding box as polygon if geom is complex)
            # In a real app, we'd reconstruct the full polygon from el['geometry']
            bounds = el.get('bounds', {})
            if not bounds:
                continue
            
            # Create a simple box polygon from bounding box
            min_lat, min_lon = bounds['minlat'], bounds['minlon']
            max_lat, max_lon = bounds['maxlat'], bounds['maxlon']
            
            wkt = f'POLYGON(({min_lon} {min_lat}, {max_lon} {min_lat}, {max_lon} {max_lat}, {min_lon} {max_lat}, {min_lon} {min_lat}))'
            
            print(f"  → Syncing {name} (Level {admin_level})...")
            
            await conn.execute(text("""
                INSERT INTO administrative_boundaries (osm_id, osm_type, name, admin_level, geometry, tags)
                VALUES (:osm_id, 'relation', :name, :admin_level, ST_GeomFromText(:wkt, 4326), :tags)
                ON CONFLICT (osm_id) DO UPDATE SET 
                    name = EXCLUDED.name,
                    geometry = EXCLUDED.geometry,
                    tags = EXCLUDED.tags;
            """), {
                "osm_id": osm_id,
                "name": name,
                "admin_level": admin_level,
                "wkt": wkt,
                "tags": json.dumps(tags)
            })
            
    await engine.dispose()
    print("✅ Real-time OSM syncing for Hanoi completed!")

if __name__ == "__main__":
    asyncio.run(sync_hanoi_osm())
