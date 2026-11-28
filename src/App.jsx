import React, { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
const SavedItineraryModal = lazy(() => import('./components/SavedItineraryModal'));

const HomePage = lazy(() => import('./pages/HomePage'));
const RegionsPage = lazy(() => import('./pages/RegionsPage'));
const CountiesPage = lazy(() => import('./pages/CountiesPage'));
const CountyDetailPage = lazy(() => import('./pages/CountyDetailPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const TravelIdeasPage = lazy(() => import('./pages/TravelIdeasPage'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const TownDetailPage = lazy(() => import('./pages/TownDetailPage'));
const TownDirectoryPage = lazy(() => import('./pages/TownDirectoryPage'));
const AttractionDetailPage = lazy(() => import('./pages/AttractionDetailPage'));

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Saved items state in LocalStorage
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const stored = localStorage.getItem('nc_travel_saved_itinerary');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nc_travel_saved_itinerary', JSON.stringify(savedItems));
    } catch (e) {
      console.error(e);
    }
  }, [savedItems]);

  // Apply an archive-only visual theme without changing the rest of the travel guide.
  useEffect(() => {
    const path = currentPath.toLowerCase();
    const isArchivePath = path === "/history" || path.startsWith("/history/") || path === "/aboriginal" || path.startsWith("/aboriginal/") || /^\/counties\/[^/]+\/history(?:\/|$)/.test(path);
    document.body.classList.toggle("dark-archive", isArchivePath);
    return () => document.body.classList.remove("dark-archive");
  }, [currentPath]);

  // Keep route metadata aligned while loading record datasets only for routes that need them.
  useEffect(() => {
    let cancelled = false;
    const updateRouteMetadata = async () => {
    const defaultPage = {
      title: "North Carolina Travel Guide | Explore All 100 Counties",
      description: "Plan your North Carolina trip with a guide to all 100 counties, mountain and coastal regions, attractions, places to stay, local dining, history, and travel ideas.",
      type: "WebPage",
      about: "North Carolina travel, destinations, and regional heritage",
      keywords: ["North Carolina travel guide", "North Carolina destinations", "100 counties"]
    };
    const pageDefinitions = {
      "/regions": {
        title: "North Carolina Regions & Sub-Regions | NC Travel Guide",
        description: "Explore North Carolina's four broad travel regions and 17 sub-regions, from the Blue Ridge Mountains and Piedmont cities to the Sandhills and Atlantic coast.",
        type: "CollectionPage",
        about: "North Carolina geographic regions and travel destinations",
        keywords: ["North Carolina regions", "Blue Ridge Mountains", "Piedmont", "Sandhills", "North Carolina coast"]
      },
      "/counties": {
        title: "All 100 North Carolina Counties | County Travel Guides",
        description: "Browse all 100 North Carolina counties with local hubs, regional context, attractions, itineraries, travel logistics, places to stay, and dining discovery.",
        type: "CollectionPage",
        about: "The 100 counties of North Carolina",
        keywords: ["North Carolina counties", "100 NC counties", "county travel guides"]
      },
      "/history": {
        title: "North Carolina History & Heritage | NC Travel Guide",
        description: "Explore North Carolina history and heritage through historic milestones, archival photographs, primary-source records, and links to holding institutions.",
        type: "CollectionPage",
        about: "North Carolina history, historic places, and regional heritage",
        keywords: ["North Carolina history", "North Carolina heritage", "historic places", "archival photographs", "primary sources"]
      },
      "/travel-ideas": {
        title: "North Carolina Travel Ideas & Itineraries | NC Travel Guide",
        description: "Explore North Carolina travel ideas, regional itineraries, attractions, and destination inspiration across the state's mountains, Piedmont, Sandhills, and coast.",
        type: "CollectionPage",
        about: "North Carolina destinations, travel ideas, and visitor experiences",
        keywords: ["North Carolina travel", "North Carolina itineraries", "North Carolina destinations", "things to do in North Carolina"]
      },
      "/towns": {
        title: "North Carolina Towns & Communities | NC Travel Guide",
        description: "Search and explore 361 North Carolina town and community profiles connected to county guides, regional context, mapped coordinates, and local resources.",
        type: "CollectionPage",
        about: "North Carolina towns, cities, and communities",
        keywords: ["North Carolina towns", "North Carolina cities", "towns and communities"]
      },
      "/experiences": {
        title: "North Carolina Attractions, Hotels & Dining | Experiences Directory",
        description: "Search a statewide directory of North Carolina attractions, outdoor recreation, hotels, resorts, restaurants, and visitor experiences by county and region.",
        type: "CollectionPage",
        about: "North Carolina attractions, accommodations, restaurants, and visitor experiences",
        keywords: ["North Carolina attractions", "things to do in North Carolina", "North Carolina hotels", "North Carolina restaurants"]
      }
    };

    const path = currentPath.toLowerCase().replace(/\/+$/, "") || "/";
    let page = pageDefinitions[path] || defaultPage;
    let canonicalPath = path;
    let countyRecord = null;
    let countyHistoryRecord = null;
    let countyName = null;
    let townRecord = null;
    let attractionRecord = null;
    const attractionMatch = path.match(/^\/attractions\/([^/]+)/);
    if (attractionMatch) {
      const { default: attractionsData } = await import('./data/attractions.json');
      if (cancelled) return;
      attractionRecord = attractionsData.find((record) => record.Slug === attractionMatch[1]) || null;
      if (attractionRecord) {
        page = {
          title: `${attractionRecord.Attractions} | North Carolina Attraction Guide`,
          description: attractionRecord.Description || `Explore ${attractionRecord.Attractions} in North Carolina.`,
          type: "TouristAttraction",
          about: attractionRecord.Attractions,
          keywords: [attractionRecord.Attractions, `${attractionRecord.City || "North Carolina"} attractions`, "North Carolina attractions"]
        };
        canonicalPath = `/attractions/${attractionMatch[1]}`;
      }
    }
    const townMatch = path.match(/^\/towns\/([^/]+)/);
    if (townMatch) {
      const { default: citiesData } = await import('./data/cities.json');
      if (cancelled) return;
      townRecord = citiesData.find((record) => record.Slug === townMatch[1]) || null;
      if (townRecord) {
        page = {
          title: `${townRecord.City}, NC Visitor Guide | NC Travel Guide`,
          description: townRecord.Description || `Explore ${townRecord.City}, North Carolina, with county connections, local resources, and regional travel context.`,
          type: "City",
          about: `${townRecord.City}, North Carolina`,
          keywords: [`${townRecord.City} NC`, `${townRecord.City} visitor guide`, "North Carolina towns"]
        };
        canonicalPath = `/towns/${townMatch[1]}`;
      }
    }

    const countyMatch = path.match(/^\/counties\/([^/]+)/);
    if (countyMatch) {
      const tab = path.split("/")[3] || "guides";
      const { default: countiesData } = await import('./data/counties.json');
      if (cancelled) return;
      countyRecord = countiesData.find((record) => record.Slug === countyMatch[1]) || null;
      if (tab === "history") {
        const { default: countyHistoryData } = await import('./data/county-history.json');
        if (cancelled) return;
        countyHistoryRecord = countyHistoryData.counties?.[countyMatch[1]] || null;
      }
      countyName = countyRecord?.County?.replace(/\s+County$/i, "").trim() || countyMatch[1].replace(/-county$/i, "").replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
      const tabNames = {
        guides: "Travel Guide",
        history: "History Vault",
        visit: "Visit & Logistics",
        "things-to-do": "Things to Do",
        municipalities: "Towns & Municipalities",
        "stay-and-eat": "Places to Stay & Eat"
      };
      page = {
        title: `${countyName} County, NC ${tabNames[tab] || "Travel Guide"} | NC Travel Guide`,
        description: `Plan a visit to ${countyName} County, North Carolina. Explore local attractions, towns, travel ideas, lodging, dining, and visitor information.`,
        type: "CollectionPage",
        about: `${countyName} County, North Carolina travel and visitor information`,
        keywords: [`${countyName} County NC`, `${countyName} County travel guide`, `${countyName} County attractions`]
      };
      canonicalPath = tab === "history" && countyHistoryRecord
        ? path
        : `/counties/${countyMatch[1]}`;
      if (tab === "history" && countyHistoryRecord) {
        page.description = countyHistoryRecord.seo_description || `Explore source-reviewed historical records and archival references for ${countyName} County, North Carolina.`;
      }
    }

    if (!pageDefinitions[path] && !countyMatch && !townMatch && !attractionMatch && path !== "/" && path !== "/index.html") {
      page = defaultPage;
      canonicalPath = "/";
    }

    document.title = page.title;
    const setMeta = (selector, attribute, value) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (attribute === "property") tag.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        else tag.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", page.description);
    // Keep one standards-based HTML description tag even if a prior render/plugin added duplicates.
    const descriptionTags = document.head.querySelectorAll('meta[name="description"]');
    descriptionTags.forEach((tag, index) => {
      if (index > 0) tag.remove();
    });
    setMeta('meta[property="og:title"]', "property", page.title);
    setMeta('meta[property="og:description"]', "property", page.description);
    setMeta('meta[property="og:url"]', "property", `https://nctravelguide.us.mw${canonicalPath}`);
    setMeta('meta[name="twitter:title"]', "name", page.title);
    setMeta('meta[name="twitter:description"]', "name", page.description);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    const canonicalUrl = `https://nctravelguide.us.mw${canonicalPath}`;
    canonicalTag.setAttribute("href", canonicalUrl);

    const existingSchema = document.getElementById("nc-travel-guide-route-schema");
    if (existingSchema) existingSchema.remove();
    if (path !== "/" && path !== "/index.html" && canonicalPath !== "/") {
      const schema = {
        "@context": "https://schema.org",
        "@type": page.type,
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": page.title,
        "description": page.description,
        "isPartOf": { "@id": "https://nctravelguide.us.mw/#website" },
        "author": { "@id": "https://nctravelguide.us.mw/#creator" },
        "about": townRecord
          ? {
              "@type": "City",
              "name": `${townRecord.City}, North Carolina`,
              "containedInPlace": String(townRecord.County || "").split("/").map((reference) => reference.trim() + " County, North Carolina")
            }
          : countyRecord
            ? {
                "@type": "AdministrativeArea",
                "name": `${countyName} County, North Carolina`,
                "containedInPlace": { "@type": "State", "name": "North Carolina" }
              }
            : { "@type": "Thing", "name": page.about },
        "keywords": page.keywords.join(", "),
        "inLanguage": "en-US"
      };
      if (townRecord && Number.isFinite(Number(townRecord.Latitude)) && Number.isFinite(Number(townRecord.Longitude))) {
        schema.geo = { "@type": "GeoCoordinates", latitude: Number(townRecord.Latitude), longitude: Number(townRecord.Longitude) };
        schema.sameAs = townRecord["Tourism Website"];
      }
      const script = document.createElement("script");
      script.id = "nc-travel-guide-route-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    };

    updateRouteMetadata().catch((error) => {
      if (!cancelled) console.error("[route-metadata] Could not update route metadata:", error);
    });

    return () => {
      cancelled = true;
      const activeSchema = document.getElementById("nc-travel-guide-route-schema");
      if (activeSchema) activeSchema.remove();
    };
  }, [currentPath]);

  // Listen to popstate (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Client-side router navigation helper
  const navigate = (path, scroll = true) => {
    const [pathPart, queryPart] = path.split('?');
    window.history.pushState({}, '', path);
    setCurrentPath(pathPart);
    setSearchParams(new URLSearchParams(queryPart ? `?${queryPart}` : ''));
    if (scroll) {
      window.scrollTo(0, 0);
    }
  };

  // Toggle Save Item to Itinerary
  const handleToggleSave = (item) => {
    setSavedItems((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      if (exists) {
        return prev.filter((x) => x.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemoveSavedItem = (id) => {
    setSavedItems((prev) => prev.filter((x) => x.id !== id));
  };

  const isSaved = (id) => savedItems.some((x) => x.id === id);

  // Route matching logic
  const renderPage = () => {
    const path = currentPath.toLowerCase();

    // 1. Homepage
    if (path === '/' || path === '/index.html') {
      return <HomePage navigate={navigate} onToggleSave={handleToggleSave} isSaved={isSaved} />;
    }

    // 2. Regions Hub
    if (path === '/regions' || path.startsWith('/regions/')) {
      return <RegionsPage navigate={navigate} />;
    }

    // 3. Counties Hub or County Detail
    if (path.startsWith('/counties')) {
      const parts = path.split('/').filter(Boolean); // e.g. ['counties', 'wake-county', 'visit']
      if (parts.length === 1) {
        return <CountiesPage navigate={navigate} initialRegion={searchParams.get('region') || 'all'} />;
      }
      if (parts.length >= 2) {
        const countySlug = parts[1];
        const subTab = parts[2] || 'guides';
        return (
          <CountyDetailPage
            countySlug={countySlug}
            subTab={subTab}
            navigate={navigate}
            onToggleSave={handleToggleSave}
            isSaved={isSaved}
          />
        );
      }
    }

    // 4. NC History Page
    if (path === '/history' || path.startsWith('/history/')) {
      return <HistoryPage navigate={navigate} />;
    }

    // 5. Travel Ideas & Hotspots
    if (path === '/travel-ideas' || path.startsWith('/travel-ideas/')) {
      return <TravelIdeasPage navigate={navigate} onToggleSave={handleToggleSave} isSaved={isSaved} />;
    }

    // 6. Attraction detail profiles
    if (path.startsWith("/attractions/")) {
      return <AttractionDetailPage attractionSlug={path.split("/")[2]} navigate={navigate} />;
    }

    // 7. Towns and communities directory
    if (path === '/towns') {
      return <TownDirectoryPage navigate={navigate} />;
    }

    // 7. Town and community profiles
    if (path.startsWith('/towns/')) {
      return <TownDetailPage townSlug={path.split('/')[2]} navigate={navigate} />;
    }

    // 7. Experiences Master Directory
    if (path === '/experiences' || path.startsWith('/experiences/')) {
      const initialQuery = searchParams.get('query') || '';
      return (
        <ExperiencesPage
          initialQuery={initialQuery}
          initialRegion={searchParams.get('region') || 'all'}
          navigate={navigate}
          onToggleSave={handleToggleSave}
          isSaved={isSaved}
        />
      );
    }

    // Fallback to Homepage
    return <HomePage navigate={navigate} onToggleSave={handleToggleSave} isSaved={isSaved} />;
  };

  return (
    <div className="app-container">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        savedItemsCount={savedItems.length}
        onOpenSaved={() => setIsSavedOpen(true)}
      />

      <main className="main-content">
        <Suspense fallback={
          <div className="container" role="status" aria-live="polite" style={{ minHeight: '50vh', paddingTop: '4rem', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            Loading this guide section…
          </div>
        }>
          {renderPage()}
        </Suspense>
      </main>

      <Footer navigate={navigate} />

      {isSavedOpen && (
        <Suspense fallback={<div role="status" aria-live="polite" style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.55)', color: '#fff' }}>Opening saved itinerary…</div>}>
          <SavedItineraryModal
            isOpen={isSavedOpen}
            onClose={() => setIsSavedOpen(false)}
            savedItems={savedItems}
            onRemoveItem={handleRemoveSavedItem}
            navigate={navigate}
          />
        </Suspense>
      )}
    </div>
  );
}
