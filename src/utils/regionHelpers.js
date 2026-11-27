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
