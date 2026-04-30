// ═══════════════════════════════════════════════
//  ASQUARE & CO. — GOA-FIRST TRAVEL DATA
// ═══════════════════════════════════════════════

export const destinations = [
  // ── GOA FIRST ──────────────────────────────
  {
    id: 1, name: 'North Goa', country: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    price: 349, rating: 4.9, reviews: 5821, tag: 'Most Popular', duration: '4 Days',
    highlights: ['Baga Beach','Anjuna Flea Market','Nightlife','Water Sports'],
    description: 'Vibrant beaches, legendary nightlife, and colonial charm — the heartbeat of Goa that never stops.',
    category: 'Goa',
  },
  {
    id: 2, name: 'South Goa', country: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80',
    price: 299, rating: 4.85, reviews: 3412, tag: 'Serene Escape', duration: '5 Days',
    highlights: ['Palolem Beach','Dudhsagar Falls','Spice Plantations','Quiet Coves'],
    description: 'Unspoiled beaches and whispering palms — where Goa slows down to let you breathe.',
    category: 'Goa',
  },
  {
    id: 3, name: 'Old Goa Heritage', country: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80',
    price: 199, rating: 4.8, reviews: 2108, tag: 'Cultural', duration: '2 Days',
    highlights: ['Basilica of Bom Jesus','Se Cathedral','Fontainhas Quarter','Spice Farm Tour'],
    description: 'Walk through 500 years of Portuguese history in a UNESCO World Heritage city of golden churches.',
    category: 'Goa',
  },
  {
    id: 4, name: 'Goa Hinterland', country: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    price: 249, rating: 4.75, reviews: 987, tag: 'Adventure', duration: '3 Days',
    highlights: ['Dudhsagar Trek','Backwater Kayaking','Village Homestay','Spice Trail'],
    description: 'Escape the beach crowd — emerald forests, cascading waterfalls, and authentic Goan village life.',
    category: 'Goa',
  },
  {
    id: 5, name: 'Luxury Goa Retreat', country: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    price: 799, rating: 4.95, reviews: 1243, tag: 'Luxury', duration: '5 Days',
    highlights: ['5-Star Resorts','Private Beach','Sunset Cruise','Gourmet Dining'],
    description: 'The finest resorts, private beaches and candlelit seafood dinners — Goa at its most indulgent.',
    category: 'Goa',
  },

  // ── REST OF INDIA ───────────────────────────
  {
    id: 6, name: 'Kerala', country: 'India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    price: 799, rating: 4.8, reviews: 3456, tag: 'India Special', duration: '7 Days',
    highlights: ['Backwater Cruise','Ayurveda Spa','Tea Plantations','Elephant Safari'],
    description: "Float through God's Own Country on a houseboat surrounded by emerald backwaters.",
    category: 'India',
  },
  {
    id: 7, name: 'Rajasthan Royal', country: 'India',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    price: 899, rating: 4.78, reviews: 2765, tag: 'Heritage', duration: '8 Days',
    highlights: ['Jaipur Palaces','Jaisalmer Dunes','Udaipur Lake','Camel Safari'],
    description: 'Rajputana grandeur, painted cities and golden deserts — India at its most regal.',
    category: 'India',
  },
  {
    id: 8, name: 'Maldives', country: 'Indian Ocean',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    price: 2499, rating: 4.95, reviews: 1876, tag: 'Luxury', duration: '5 Days',
    highlights: ['Overwater Villas','Snorkeling','Dolphin Cruise','Spa Retreat'],
    description: 'Turquoise lagoons and pristine coral reefs at the most exclusive island paradise.',
    category: 'Asia',
  },
  {
    id: 9, name: 'Bali', country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    price: 999, rating: 4.7, reviews: 4521, tag: 'Best Value', duration: '7 Days',
    highlights: ['Rice Terraces','Temple Visits','Cooking Class','Surf Lessons'],
    description: 'The Island of Gods — where spiritual energy, lush jungles, and golden beaches converge.',
    category: 'Asia',
  },
  {
    id: 10, name: 'Santorini', country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    price: 1299, rating: 4.9, reviews: 2341, tag: 'Scenic', duration: '7 Days',
    highlights: ['Caldera Views','Wine Tasting','Sunset Cruise','Ancient Ruins'],
    description: 'Whitewashed villages perched on volcanic cliffs overlooking the stunning Aegean Sea.',
    category: 'Europe',
  },
  {
    id: 11, name: 'Dubai', country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    price: 1599, rating: 4.75, reviews: 2987, tag: 'City Break', duration: '5 Days',
    highlights: ['Burj Khalifa','Desert Safari','Gold Souk','Luxury Shopping'],
    description: 'Where luxury and adventure collide in a city that dared to dream bigger.',
    category: 'Middle East',
  },
  {
    id: 12, name: 'Swiss Alps', country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    price: 2599, rating: 4.92, reviews: 1432, tag: 'Winter Special', duration: '7 Days',
    highlights: ['Jungfraujoch','Ski Slopes','Scenic Rail','Cheese Fondue'],
    description: 'Snow-crowned peaks and crystal lakes inspire pure alpine wonder.',
    category: 'Europe',
  },
];

export const packages = [
  // ── GOA PACKAGES FIRST ──────────────────────
  {
    id: 'g1', name: 'Goa Sun & Soul Escape', destinations: ['North Goa', 'South Goa'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    price: 599, duration: '5 Days / 4 Nights', savings: 150, rating: 4.97,
    includes: ['Beach Resort Stay','Daily Breakfast','Sunset Cruise','Water Sports','Airport Transfers','Local Sightseeing'],
    tag: '🌴 Goa Special', color: '#FF6B35',
  },
  {
    id: 'g2', name: 'Goa Honeymoon Bliss', destinations: ['Luxury Goa', 'South Goa'],
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    price: 899, duration: '6 Days / 5 Nights', savings: 200, rating: 4.99,
    includes: ['Private Pool Villa','Candlelit Dinner','Couples Spa','Sunset Dolphin Cruise','Flower Bed Decor','Champagne Welcome'],
    tag: '❤️ Goa Honeymoon', color: '#E85520',
  },
  {
    id: 'g3', name: 'Goa Heritage & Beach', destinations: ['Old Goa', 'North Goa', 'South Goa'],
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80',
    price: 749, duration: '7 Days / 6 Nights', savings: 180, rating: 4.88,
    includes: ['Boutique Hotel','Guided Heritage Walk','Feni Tasting','Spice Farm Tour','Beach Day','Ferry Ride'],
    tag: '🏛️ Culture + Beach', color: '#00A896',
  },
  {
    id: 'g4', name: 'Goa Adventure Rush', destinations: ['Goa Hinterland', 'North Goa'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    price: 549, duration: '4 Days / 3 Nights', savings: 100, rating: 4.82,
    includes: ['Eco Resort Stay','Dudhsagar Trek','Kayaking','Zipline','Village Walk','Waterfall Swim'],
    tag: '🏔️ Adventure', color: '#3D5A99',
  },

  // ── OTHER PACKAGES ──────────────────────────
  {
    id: 'p1', name: 'Honeymoon Bliss — Maldives & Bali', destinations: ['Maldives', 'Bali'],
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    price: 3799, duration: '12 Days', savings: 800, rating: 4.98,
    includes: ['5-Star Hotels','Flights Included','Private Transfers','Romantic Dinners','Spa Credits','Snorkeling Tours'],
    tag: '❤️ International Honeymoon', color: '#FF6B35',
  },
  {
    id: 'p2', name: 'India Heritage Trail', destinations: ['Rajasthan', 'Kerala', 'Goa'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    price: 1999, duration: '14 Days', savings: 600, rating: 4.88,
    includes: ['Heritage Hotels','Domestic Flights','Private Driver','Cooking Class','Palace Dinners','Ayurveda Spa'],
    tag: '🇮🇳 India Grand Tour', color: '#F59E0B',
  },
];

export const testimonials = [
  {
    id: 1, name: 'Priya & Rohit Sharma', location: 'Mumbai', trip: 'Goa Honeymoon Bliss', rating: 5,
    text: "Our Goa honeymoon was perfect in every way — private pool villa, sunset cruise, the most romantic candlelit dinner on the beach. Asquare & Co. thought of everything!",
    avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=FF6B35&color=fff&size=80',
  },
  {
    id: 2, name: 'James Harrington', location: 'London', trip: 'Goa Sun & Soul Escape', rating: 5,
    text: "I came for 5 days and stayed for 10! The beach resort, the water sports, the seafood — Goa stole my heart. Asquare & Co. made it ridiculously easy to plan.",
    avatar: 'https://ui-avatars.com/api/?name=James+H&background=3D5A99&color=fff&size=80',
  },
  {
    id: 3, name: 'Anika Bose', location: 'Bangalore', trip: 'Goa Heritage & Beach', rating: 5,
    text: "The Old Goa heritage walk followed by chilling at Palolem — two completely different Goas in one trip! Asquare & Co. curated it flawlessly.",
    avatar: 'https://ui-avatars.com/api/?name=Anika+B&background=00A896&color=fff&size=80',
  },
  {
    id: 4, name: 'Marco Deluca', location: 'Milan', trip: 'Goa Adventure Rush', rating: 5,
    text: "Dudhsagar waterfall trek at sunrise — I have no words. The hinterland of Goa is a completely different world. This trip changed me. Thank you Asquare & Co.!",
    avatar: 'https://ui-avatars.com/api/?name=Marco+D&background=F59E0B&color=fff&size=80',
  },
];

export const stats = [
  { value: 50000, label: 'Happy Travelers', suffix: '+', icon: '😊' },
  { value: 2000, label: 'Goa Trips Planned', suffix: '+', icon: '🌴' },
  { value: 15, label: 'Years in Goa', suffix: '', icon: '🏆' },
  { value: 98, label: 'Satisfaction %', suffix: '%', icon: '⭐' },
];

// ── GOA EXPERIENCES (for homepage section) ──────────────────
export const goaExperiences = [
  { icon: '🏄', title: 'Water Sports', desc: 'Parasailing, jet-ski, banana boat & more at Baga and Calangute' },
  { icon: '🚢', title: 'Sunset Cruise', desc: 'Cruise the Mandovi river with live Goan music and cocktails' },
  { icon: '🌶️', title: 'Spice Plantation', desc: 'Walk through aromatic spice farms with a traditional Goan lunch' },
  { icon: '🏛️', title: 'Heritage Walk', desc: 'Explore 500-year-old Portuguese churches and Fontainhas quarter' },
  { icon: '🐬', title: 'Dolphin Spotting', desc: 'Early morning boat ride to spot Goa\'s playful wild dolphins' },
  { icon: '🎵', title: 'Goan Nightlife', desc: 'Beach shacks, live music, and nights that stretch into dawn' },
];
