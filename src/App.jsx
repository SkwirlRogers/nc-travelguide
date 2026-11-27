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
    } catch (e) {
      console.error(e);
    }
  }, [savedItems]);

  // Keep route metadata and structured data aligned with the active SPA page.
  useEffect(() => {
    const pageDefinitions = {
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
      }
    };
    const path = currentPath.toLowerCase().replace(/\\/$/, "") || "/";
    const page = pageDefinitions[path];
    if (!page) return;

    document.title = page.title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", page.description);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    const canonicalUrl = `https://nctravelguide.us.mw${path}`;
    canonicalTag.setAttribute("href", canonicalUrl);

    const existingSchema = document.getElementById("nc-travel-guide-route-schema");
    if (existingSchema) existingSchema.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": page.type,
      "@id": `${canonicalUrl}#webpage`,
      "url": canonicalUrl,
      "name": page.title,
      "description": page.description,
      "isPartOf": { "@id": "https://nctravelguide.us.mw/#website" },
      "author": { "@id": "https://nctravelguide.us.mw/#creator" },
      "about": {
        "@type": "Thing",
        "name": page.about
      },
      "keywords": page.keywords.join(", "),
      "inLanguage": "en-US"
    };
    const script = document.createElement("script");
    script.id = "nc-travel-guide-route-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

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
