import attractionsData from "../data/attractions.json";
import hotelsData from "../data/hotels.json";
import restaurantsData from "../data/restaurants.json";
import { makeSlug } from "./countyDirectoryHelpers";

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
