import countiesData from '../data/counties.json';
import citiesData from '../data/cities.json';
import attractionsData from '../data/attractions.json';
import hotelsData from '../data/hotels.json';
import restaurantsData from '../data/restaurants.json';
import regionsData from '../data/regions.json';
import subRegionsData from '../data/sub_regions.json';
import countyHistoryData from '../data/county-history.json';

// Helper to make clean URL slugs
export function makeSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Format population numbers cleanly
export function formatNumber(val) {
  if (!val) return 'N/A';
  const clean = String(val).replace(/,/g, '').split('.')[0];
  const num = parseInt(clean, 10);
  if (isNaN(num)) return val;
  return num.toLocaleString();
}

// Get all 100 counties with aggregated counts
export function getAllCounties() {
  return countiesData.map(c => {
    const rawCountyName = c.County.replace(/\s+County$/i, '').trim();
    
    // Count associated cities
    const countyCities = citiesData.filter(city => 
      city.County && (
        city.County.toLowerCase().trim() === c.County.toLowerCase().trim() ||
        city.County.toLowerCase().trim() === rawCountyName.toLowerCase()
      )
    );

    // Count associated attractions
    const countyAttractions = attractionsData.filter(a =>
      a.County && (
        a.County.toLowerCase().trim() === c.County.toLowerCase().trim() ||
        a.County.toLowerCase().trim() === rawCountyName.toLowerCase()
      )
    );

    // Count associated hotels
    const countyHotels = hotelsData.filter(h =>
      h.County && (
        h.County.toLowerCase().trim() === c.County.toLowerCase().trim() ||
        h.County.toLowerCase().trim() === rawCountyName.toLowerCase()
      )
    );

    // Count associated restaurants
    const countyRestaurants = restaurantsData.filter(r =>
      r.County && (
        r.County.toLowerCase().trim() === c.County.toLowerCase().trim() ||
        r.County.toLowerCase().trim() === rawCountyName.toLowerCase()
      )
    );

    const slug = c.Slug || makeSlug(c.County);

    return {
      ...c,
      slug,
      rawCountyName,
      cityCount: countyCities.length,
      attractionCount: countyAttractions.length,
      hotelCount: countyHotels.length,
      restaurantCount: countyRestaurants.length,
      totalExperiencesCount: countyAttractions.length + countyHotels.length + countyRestaurants.length
    };
  });
}

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
    c.County && (c.County.toLowerCase().trim() === county.County.toLowerCase().trim() || c.County.toLowerCase().trim() === rawName)
  );

  const attractions = attractionsData.filter(a => 
    a.County && (a.County.toLowerCase().trim() === county.County.toLowerCase().trim() || a.County.toLowerCase().trim() === rawName)
  );

  const hotels = hotelsData.filter(h => 
    h.County && (h.County.toLowerCase().trim() === county.County.toLowerCase().trim() || h.County.toLowerCase().trim() === rawName)
  );

  const restaurants = restaurantsData.filter(r => 
    r.County && (r.County.toLowerCase().trim() === county.County.toLowerCase().trim() || r.County.toLowerCase().trim() === rawName)
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

// Region summaries
export function getMacroRegions() {
  return [
    {
      name: 'Mountain',
      slug: 'mountain',
      subRegions: ['Blue Ridge Mountains', 'Smoky Mountains', 'High Country', 'Foothills'],
      description: 'Towering peaks, the historic Blue Ridge Parkway, roaring waterfalls, Asheville craft breweries, and dramatic mountain ridges.',
      featuredCities: 'Asheville, Boone, Blowing Rock, Hendersonville',
      countiesCount: 24,
      image: '/images/hero-linn-cove.jpg'
    },
    {
      name: 'Central Piedmont',
      slug: 'central-piedmont',
      subRegions: ['The Triangle', 'Charlotte Metro', 'The Triad', 'Lake Norman Region'],
      description: 'The bustling economic and cultural heartland of NC, home to Raleigh, Charlotte, Greensboro, world-class dining, and research hubs.',
      featuredCities: 'Raleigh, Charlotte, Durham, Winston-Salem, Cary',
      countiesCount: 34,
      image: '/images/piedmont_cityscape.jpg'
    },
    {
      name: 'Atlantic Coastal',
      slug: 'atlantic-coastal',
      subRegions: ['Outer Banks', 'Crystal Coast', 'Cape Fear Coast', 'Brunswick Islands', 'Inner Banks'],
      description: '300+ miles of barrier islands, historic lighthouses, wild horses, oceanfront resorts, and fresh coastal seafood.',
      featuredCities: 'Wilmington, Nags Head, Beaufort, Emerald Isle',
      countiesCount: 22,
      image: '/images/coastal_lighthouse.jpg'
    },
    {
      name: 'Inland-Inner Coastal / Sandhills',
      slug: 'sandhills',
      subRegions: ['Sandhills', 'Uwharrie Lakes', 'Yadkin Valley'],
      description: 'Famous Pinehurst golf courses, longleaf pine forests, agricultural heritage, speedways, and tranquil lake communities.',
      featuredCities: 'Pinehurst, Southern Pines, Fayetteville, Asheboro',
      countiesCount: 20,
      image: '/images/sandhills_golf.jpg'
    }
  ];
}

// Master search & directory query function
export function searchExperiences({ query = '', type = 'all', region = 'all', county = 'all', category = 'all', limit = 100 }) {
  const results = [];

  const q = query.toLowerCase().trim();

  // Search Attractions
  if (type === 'all' || type === 'attractions') {
    attractionsData.forEach(item => {
      const title = item.Attractions || '';
      const desc = item.Description || '';
      const city = item.City || '';
      const itemCounty = item.County || '';
      const itemRegion = item.Region || '';
      const cat = item.Category || 'Attraction';
      const targetLink = item['Website / Affiliate Link'] || '';

      const matchQuery = !q || (title + desc + city + itemCounty + cat).toLowerCase().includes(q);
      const matchRegion = region === 'all' || (itemRegion.toLowerCase().includes(region.toLowerCase()));
      const matchCounty = county === 'all' || (itemCounty.toLowerCase() === county.toLowerCase());
      const matchCategory = category === 'all' || (cat.toLowerCase() === category.toLowerCase());

      if (matchQuery && matchRegion && matchCounty && matchCategory) {
        results.push({
          id: `attr-${makeSlug(title)}`,
          title,
          type: 'Attraction',
          category: cat,
          city,
          county: itemCounty,
          region: itemRegion,
          description: desc,
          address: item.Address || `${city}, NC`,
          targetLink,
          slug: item.Slug || makeSlug(title)
        });
      }
    });
  }

  // Search Hotels
  if (type === 'all' || type === 'hotels') {
    hotelsData.forEach(item => {
      const title = item['Hotel & Resort'] || '';
      const desc = item.Description || '';
      const city = item.City || '';
      const itemCounty = item.County || '';
      const itemRegion = item.Region || '';
      const cat = item.Category || 'Resort';
      const targetLink = item.Target_Link || '';

      const matchQuery = !q || (title + desc + city + itemCounty + cat).toLowerCase().includes(q);
      const matchRegion = region === 'all' || (itemRegion.toLowerCase().includes(region.toLowerCase()));
      const matchCounty = county === 'all' || (itemCounty.toLowerCase() === county.toLowerCase());
      const matchCategory = category === 'all' || (cat.toLowerCase() === category.toLowerCase());

      if (matchQuery && matchRegion && matchCounty && matchCategory) {
        results.push({
          id: `hotel-${makeSlug(title)}`,
          title,
          type: 'Hotel',
          category: cat,
          city,
          county: itemCounty,
          region: itemRegion,
          description: desc,
          address: item.Address || `${city}, NC`,
          targetLink,
          slug: item.Slug || makeSlug(title)
        });
      }
    });
  }

  // Search Restaurants
  if (type === 'all' || type === 'restaurants') {
    restaurantsData.forEach(item => {
      const title = item.Restaurant || '';
      const desc = item.Description || '';
      const city = item.City || '';
      const itemCounty = item.County || '';
      const itemRegion = item.Region || item['Sub-Region'] || '';
      const cat = item.Cuisine || 'Dining';
      const targetLink = item.Target_Link || '';

      const matchQuery = !q || (title + desc + city + itemCounty + cat).toLowerCase().includes(q);
      const matchRegion = region === 'all' || (itemRegion.toLowerCase().includes(region.toLowerCase()));
      const matchCounty = county === 'all' || (itemCounty.toLowerCase() === county.toLowerCase());
      const matchCategory = category === 'all' || (cat.toLowerCase() === category.toLowerCase());

      if (matchQuery && matchRegion && matchCounty && matchCategory) {
        results.push({
          id: `rest-${makeSlug(title)}`,
          title,
          type: 'Restaurant',
          category: cat,
          city,
          county: itemCounty,
          region: itemRegion,
          description: desc,
          address: item.Address || `${city}, NC`,
          targetLink,
          slug: item.Slug || makeSlug(title)
        });
      }
    });
  }

  return results.slice(0, limit);
}
