#!/usr/bin/env python3
"""Submit newly published or removed NC Travel Guide URLs through IndexNow.

The GitHub Actions workflow keeps a sitemap snapshot between deployments. On the
first run, the current public sitemap is submitted as the initial discovery set.
Later runs submit only URLs added to or removed from the sitemap. Cloudflare
Crawler Hints separately notifies IndexNow when cache signals indicate changes.
"""
from __future__ import annotations

import os
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

HOST = "nctravelguide.us.mw"
BASE = f"https://{HOST}"
SITEMAP = f"{BASE}/sitemap.xml"
KEY = "4e85c55b-941d-4344-a06d-4af1df20af10"
ENDPOINT = "https://api.indexnow.org/indexnow"
SNAPSHOT = Path(".indexnow/sitemap-snapshot.txt")
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "NCTravelGuide-IndexNow/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"GET {url} returned HTTP {response.status}")
        return response.read()


def sitemap_urls(url: str, depth: int = 0) -> set[str]:
    if depth > 2:
        raise RuntimeError("Sitemap nesting exceeded safety limit")
    root = ET.fromstring(get(url))
    kind = root.tag.rsplit("}", 1)[-1]
    found: set[str] = set()
    if kind == "sitemapindex":
        for item in root.findall("sm:sitemap/sm:loc", NS):
            if item.text:
                found.update(sitemap_urls(item.text.strip(), depth + 1))
    elif kind == "urlset":
        for item in root.findall("sm:url/sm:loc", NS):
            if item.text:
                candidate = item.text.strip()
                parsed = urlparse(candidate)
                if parsed.scheme == "https" and parsed.netloc == HOST:
                    found.add(candidate)
    else:
        raise RuntimeError(f"Unexpected sitemap root element: {kind}")
    return found


def wait_for_live_sitemap() -> set[str]:
    last_error = None
    for attempt in range(18):
        try:
            urls = sitemap_urls(SITEMAP)
            if urls:
                return urls
            last_error = RuntimeError("The live sitemap contained no URLs")
        except Exception as error:  # retry while Cloudflare Pages finishes deployment
            last_error = error
        print(f"Waiting for the deployed sitemap ({attempt + 1}/18): {last_error}")
        time.sleep(10)
    raise RuntimeError(f"Could not read a populated live sitemap: {last_error}")


def submit(urls: list[str]) -> None:
    for offset in range(0, len(urls), 10000):
        batch = urls[offset:offset + 10000]
        import json
        payload = json.dumps({"host": HOST, "key": KEY, "urlList": batch}).encode("utf-8")
        request = urllib.request.Request(
            ENDPOINT,
            data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                status = response.status
        except urllib.error.HTTPError as error:
            status = error.code
            body = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"IndexNow rejected batch ({status}): {body}") from error
        if status not in (200, 202):
            raise RuntimeError(f"IndexNow returned unexpected HTTP {status}")
        print(f"IndexNow accepted batch {offset // 10000 + 1}: {len(batch)} URLs (HTTP {status})")


def main() -> int:
    current = wait_for_live_sitemap()
    previous = set()
    if SNAPSHOT.exists():
        previous = {line.strip() for line in SNAPSHOT.read_text(encoding="utf-8").splitlines() if line.strip()}

    changed = sorted(current.symmetric_difference(previous))
    if not SNAPSHOT.exists():
        print("No prior sitemap snapshot: sending the initial full discovery set.")
    if changed:
        submit(changed)
    else:
        print("No new or removed sitemap URLs; no IndexNow request needed.")

    SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT.write_text("\n".join(sorted(current)) + "\n", encoding="utf-8")
    print(f"Live sitemap contains {len(current)} canonical-host URLs; {len(changed)} URL changes submitted.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"IndexNow submission failed: {error}", file=sys.stderr)
        raise SystemExit(1)
