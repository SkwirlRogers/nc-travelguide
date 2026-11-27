import citiesData from "../data/cities.json";
import attractionsData from "../data/attractions.json";
import hotelsData from "../data/hotels.json";
import restaurantsData from "../data/restaurants.json";
import countyHistoryData from "../data/county-history.json";
import { getAllCounties, makeSlug, formatNumber } from "./countyDirectoryHelpers";

const normalizeCountyReference = (value) => String(value || "").toLowerCase()
  .replaceAll(" county", "").replaceAll(" ", "").replaceAll("-", "").replaceAll("_", "").trim();
const belongsToCounty = (reference, county) => String(reference || "").split("/")
  .some((part) => normalizeCountyReference(part) === normalizeCountyReference(county.rawCountyName)
    || normalizeCountyReference(part) === normalizeCountyReference(county.County));

export { formatNumber };

// Get single county details by slug or name
export function getCountyDetails(slugOrName) {
  const allCounties = getAllCounties();
  const targetSlug = makeSlug(slugOrName);
  
  const county = allCounties.find(c => 
    c.slug === targetSlug || 
    makeSlug(c.County) === targetSlug ||
    makeSlug(c.rawCountyName) === targetSlug
  );

  if (!county) return null;

  const rawName = county.rawCountyName.toLowerCase();

  // Filter associated entities
  const cities = citiesData.filter(c => 
    belongsToCounty(c.County, county)
  );

  const attractions = attractionsData.filter(a => 
    belongsToCounty(a.County, county)
  );

  const hotels = hotelsData.filter(h => 
    belongsToCounty(h.County, county)
  );

  const restaurants = restaurantsData.filter(r => 
    belongsToCounty(r.County, county)
  );

  // Logistics & Travel Info
  const visitInfo = getCountyVisitInfo(county);
  const itineraries = generateCountyItineraries(county, attractions, restaurants);

  return {
    ...county,
    cities,
    attractions,
    hotels,
    restaurants,
    visitInfo,
    itineraries
  };
}

// Logistics helper for County Visit sub-page
function getCountyVisitInfo(county) {
  const region = county.Region || '';
  
  let airport = 'Raleigh-Durham International Airport (RDU)';
  let bestTime = 'Spring (April–June) & Autumn (September–November)';
  let climate = 'Temperate with mild winters and warm, sunny summers.';
  let transit = 'Car travel recommended along major interstates (I-40, I-85, I-95, I-77) and scenic backways.';

  if (region.includes('Mountain')) {
    airport = 'Asheville Regional Airport (AVL) / Charlotte Douglas (CLT)';
    bestTime = 'Fall foliage peak (October) & Summer outdoor season (May–August)';
    climate = 'Cooler mountain climate with snowy winter peaks and pleasant summers.';
    transit = 'Blue Ridge Parkway routes & mountain highways (US-23, US-19, I-40).';
  } else if (region.includes('Atlantic') || region.includes('Coastal')) {
    airport = 'Wilmington International (ILM) / Coastal Carolina Regional (EWN) / Norfolk (ORF)';
    bestTime = 'Summer beach season (June–September) & tranquil shoulder months (May & October)';
    climate = 'Subtropical coastal climate with ocean breezes.';
    transit = 'NC Ferry System, US-158, NC-12 coastal highway.';
  } else if (region.includes('Sandhills')) {
    airport = 'Fayetteville Regional Airport (FAY) / RDU';
    bestTime = 'Spring & Autumn (ideal for world-class golf and outdoor equestrian events)';
    climate = 'Warm long summers and gentle winters.';
    transit = 'US-1 & NC-211 corridors.';
  }

  return {
    airport,
    bestTime,
    climate,
    transit,
    officialWebsite: county['Tourism Website'] || 'https://www.visitnc.com'
  };
}

// Generate curated itineraries
function generateCountyItineraries(county, attractions, restaurants) {
  const topAttractions = attractions.slice(0, 3);
  const topDining = restaurants.slice(0, 3);

  const day1Attraction = topAttractions[0] ? topAttractions[0].Attractions : `${county.County} Historic Downtown & Cultural District`;
  const day1Dining = topDining[0] ? topDining[0].Restaurant : 'Local Farm-to-Table Gastropub';

  const day2Attraction = topAttractions[1] ? topAttractions[1].Attractions : `Scenic Outdoor Recreation & State Parks in ${county.County}`;
  const day2Dining = topDining[1] ? topDining[1].Restaurant : 'Famous North Carolina Barbecue Joint';

  const day3Attraction = topAttractions[2] ? topAttractions[2].Attractions : `Artisan Markets & Local Landmarks of ${county.County}`;
  const day3Dining = topDining[2] ? topDining[2].Restaurant : 'Coastal Seafood Shuckhouse / Craft Brewery';

  return [
    {
      title: `3 Days in ${county.County}: The Ultimate Explorer Itinerary`,
      subtitle: `Experience the best attractions, dining hotspots, and scenic vistas in ${county.County}.`,
      days: [
        {
          day: 'Day 1',
          focus: 'Heritage & Local Culture',
          morning: `Begin your morning exploring ${day1Attraction}. Take a walking tour of the historic core and municipal square.`,
          afternoon: `Enjoy lunch at ${day1Dining}, followed by local artisan shopping and museum exhibits.`,
          evening: 'Sunset views, craft drinks, and dinner at a top-rated county bistro.'
        },
        {
          day: 'Day 2',
          focus: 'Outdoor Adventure & Landmark Sights',
          morning: `Embark on an outdoor excursion at ${day2Attraction}. Bring your camera for panoramic views!`,
          afternoon: `Recharge with authentic NC BBQ at ${day2Dining}.`,
          evening: 'Relax with live regional music or evening stargazing.'
        },
        {
          day: 'Day 3',
          focus: 'Culinary Delights & Hidden Gems',
          morning: `Visit local farmers markets or coastal waterfront docks. Highlight stop at ${day3Attraction}.`,
          afternoon: `Savor signature local dishes at ${day3Dining}.`,
          evening: 'Wrap up your trip with a memorable evening stroll.'
        }
      ]
    }
  ];
}

// Retrieve the reviewed History Vault record for a county, if one is available.
export function getCountyHistory(slugOrName) {
  const targetSlug = makeSlug(slugOrName);
  return countyHistoryData.counties?.[targetSlug] || null;
}
