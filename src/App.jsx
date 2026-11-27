import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SavedItineraryModal from './components/SavedItineraryModal';

import HomePage from './pages/HomePage';
import RegionsPage from './pages/RegionsPage';
import CountiesPage from './pages/CountiesPage';
import CountyDetailPage from './pages/CountyDetailPage';
import HistoryPage from './pages/HistoryPage';
import TravelIdeasPage from './pages/TravelIdeasPage';
import ExperiencesPage from './pages/ExperiencesPage';

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
    } catch (  // Keep page titles, descriptions, canonical URLs, and share metadata aligned with the active route.
  useEffect(() => {
    const defaults = {
      title: "North Carolina Travel Guide | Explore All 100 Counties",
      description: "Plan your North Carolina trip with a guide to all 100 counties, regions, attractions, local dining, history, and travel ideas.",
      keywords: "North Carolina travel guide, North Carolina destinations, 100 counties"
    };
    const pages = {
      "/regions": {
        title: "North Carolina Regions & Sub-Regions | NC Travel Guide",
        description: "Explore North Carolina's four broad travel regions and 17 sub-regions, from the Blue Ridge Mountains and Piedmont cities to the Sandhills and Atlantic coast.",
        keywords: "North Carolina regions, Blue Ridge Mountains, Piedmont, Sandhills, North Carolina coast"
      },
      "/counties": {
        title: "All 100 North Carolina Counties | County Travel Guides",
        description: "Browse all 100 North Carolina counties with local hubs, regional context, attractions, itineraries, travel logistics, places to stay, and dining discovery.",
        keywords: "North Carolina counties, 100 NC counties, county travel guides"
      },
      "/history": {
        title: "North Carolina History & Heritage | NC Travel Guide",
        description: "Explore North Carolina history and heritage through historic milestones, archival photographs, primary-source records, and links to holding institutions.",
        keywords: "North Carolina history, North Carolina heritage, historic places, archival photographs, primary sources"
      },
      "/travel-ideas": {
        title: "North Carolina Travel Ideas & Itineraries | NC Travel Guide",
        description: "Explore North Carolina travel ideas, regional itineraries, attractions, and destination inspiration across the state's mountains, Piedmont, Sandhills, and coast.",
        keywords: "North Carolina travel, North Carolina itineraries, North Carolina destinations, things to do in North Carolina"
      },
      "/experiences": {
        title: "North Carolina Attractions, Hotels & Dining | Experiences Directory",
        description: "Search a statewide directory of North Carolina attractions, outdoor recreation, hotels, resorts, restaurants, and visitor experiences by county and region.",
        keywords: "North Carolina attractions, things to do in North Carolina, North Carolina hotels, North Carolina restaurants"
      }
    };

    const path = currentPath.toLowerCase().replace(/\/+$/, "") || "/";
    let page = pages[path] || defaults;
    let canonicalPath = path;
    const countyMatch = path.match(/^\/counties\/([^/]+)(?:\/([^/]+))?$/);

    if (countyMatch) {
      const countyName = countyMatch[1].split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
      const tab = countyMatch[2] || "guides";
      const tabNames = {
        guides: "Travel Guide",
        visit: "Visit & Logistics",
        "things-to-do": "Things to Do",
        municipalities: "Towns & Municipalities",
        "stay-and-eat": "Places to Stay & Eat"
      };
      page = {
        title: `${countyName} County, NC ${tabNames[tab] || "Travel Guide"} | NC Travel Guide`,
        description: `Plan a visit to ${countyName} County, North Carolina. Find local attractions, towns, travel ideas, lodging, dining, and visitor information.`,
        keywords: `${countyName} County NC, ${countyName} County travel guide, ${countyName} County attractions`
      };
      canonicalPath = `/counties/${countyMatch[1]}`;
    }

    const canonicalUrl = `https://nctravelguide.us.mw${canonicalPath}`;
    const setMeta = (selector, property, value) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (property.startsWith("og:")) tag.setAttribute("property", property);
        else tag.setAttribute("name", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    document.title = page.title;
    setMeta('meta[name="description"]', "description", page.description);
    setMeta('meta[property="og:title"]', "og:title", page.title);
    setMeta('meta[property="og:description"]', "og:description", page.description);
    setMeta('meta[property="og:url"]', "og:url", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "twitter:description", page.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const oldSchema = document.getElementById("nc-travel-guide-route-schema");
    if (oldSchema) oldSchema.remove();
    if (path !== "/" && path !== "/index.html") {
      const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": page.title,
        "description": page.description,
        "isPartOf": { "@id": "https://nctravelguide.us.mw/#website" },
        "author": { "@id": "https://nctravelguide.us.mw/#creator" },
        "keywords": page.keywords,
        "inLanguage": "en-US"
      };
      const script = document.createElement("script");
      script.id = "nc-travel-guide-route-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
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
        return <CountiesPage navigate={navigate} />;
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

    // 6. Experiences Master Directory
    if (path === '/experiences' || path.startsWith('/experiences/')) {
      const initialQuery = searchParams.get('query') || '';
      return (
        <ExperiencesPage
          initialQuery={initialQuery}
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

      <main className="main-content">{renderPage()}</main>

      <Footer navigate={navigate} />

      <SavedItineraryModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedItems={savedItems}
        onRemoveItem={handleRemoveSavedItem}
        navigate={navigate}
      />
    </div>
  );
}
