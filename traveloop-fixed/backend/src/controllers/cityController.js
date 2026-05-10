import City from '../models/City.js';

export const searchCities = async (req, res) => {
  try {
    const { q, country, region } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (country) filter.country = { $regex: country, $options: 'i' };
    if (region) filter.region = { $regex: region, $options: 'i' };

    const cities = await City.find(filter).limit(20).sort({ popularity: -1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPopularCities = async (req, res) => {
  try {
    const cities = await City.find({}).sort({ popularity: -1 }).limit(10);
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedCities = async (req, res) => {
  try {
    const count = await City.countDocuments();
    if (count > 0) return res.json({ message: 'Cities already seeded', count });

    const cities = [
      { name: 'Paris', country: 'France', region: 'Europe', costIndex: 8, popularity: 95, description: 'City of Light', tags: ['romance', 'art', 'food'] },
      { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 7, popularity: 93, description: 'Where tradition meets technology', tags: ['culture', 'food', 'technology'] },
      { name: 'New York', country: 'USA', region: 'North America', costIndex: 9, popularity: 92, description: 'The city that never sleeps', tags: ['urban', 'culture', 'food'] },
      { name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 3, popularity: 88, description: 'Island paradise', tags: ['beach', 'nature', 'culture'] },
      { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 7, popularity: 87, description: 'Eternal City', tags: ['history', 'food', 'art'] },
      { name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 6, popularity: 86, description: 'Gaudi and beaches', tags: ['art', 'beach', 'food'] },
      { name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 3, popularity: 85, description: 'City of Angels', tags: ['culture', 'food', 'temples'] },
      { name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 8, popularity: 84, description: 'Future city', tags: ['luxury', 'shopping', 'modern'] },
      { name: 'London', country: 'UK', region: 'Europe', costIndex: 9, popularity: 91, description: 'Historic and cosmopolitan', tags: ['history', 'culture', 'food'] },
      { name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 8, popularity: 83, description: 'Harbour city', tags: ['beach', 'nature', 'urban'] },
      { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 7, popularity: 82, description: 'Canals and culture', tags: ['culture', 'art', 'cycling'] },
      { name: 'Singapore', country: 'Singapore', region: 'Asia', costIndex: 8, popularity: 85, description: 'Garden city', tags: ['food', 'modern', 'culture'] },
      { name: 'Prague', country: 'Czech Republic', region: 'Europe', costIndex: 5, popularity: 80, description: 'City of a hundred spires', tags: ['history', 'architecture', 'beer'] },
      { name: 'Istanbul', country: 'Turkey', region: 'Europe/Asia', costIndex: 4, popularity: 82, description: 'Where East meets West', tags: ['history', 'culture', 'food'] },
      { name: 'Maldives', country: 'Maldives', region: 'Asia', costIndex: 10, popularity: 88, description: 'Paradise islands', tags: ['beach', 'luxury', 'diving'] },
    ];

    await City.insertMany(cities);
    res.json({ message: 'Cities seeded', count: cities.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
