// Mock base44 client with dummy data for standalone deployment
const mockData = {
  SiteSettings: {
    list: async () => [
      { key: "hero_title", value: "WestSide Barbershop Gyöngyös" },
      { key: "hero_subtitle", value: "Profi vágások, precíz átmenetek, extra vagányság." },
      { key: "phone", value: "+36 30 388 5043" },
      { key: "address", value: "Török Ignác utca 2, Gyöngyös" },
      { key: "hours_weekday", value: "10:00 – 18:00" },
      { key: "hours_saturday", value: "10:00 – 15:30" },
      { key: "facebook_url", value: "https://www.facebook.com/" },
      { key: "instagram_url", value: "https://www.instagram.com/" },
    ]
  },
  Service: {
    filter: async () => [
      { id: 1, name: "Hajvágás", price: "3 500 Ft", duration: "30 min", sort_order: 1, active: true },
      { id: 2, name: "Borotva", price: "2 000 Ft", duration: "20 min", sort_order: 2, active: true },
      { id: 3, name: "Hajvágás + Borotva", price: "5 000 Ft", duration: "45 min", sort_order: 3, active: true },
      { id: 4, name: "Gyerek vágás", price: "2 500 Ft", duration: "25 min", sort_order: 4, active: true },
      { id: 5, name: "Szakáll formázás", price: "1 500 Ft", duration: "15 min", sort_order: 5, active: true },
      { id: 6, name: "Teljes csomag", price: "7 000 Ft", duration: "60 min", sort_order: 6, active: true },
    ]
  },
  Booking: {
    list: async () => [],
    create: async (data) => ({ id: Math.random(), ...data }),
    update: async (id, data) => ({ id, ...data }),
    filter: async () => [],
  },
  GalleryImage: {
    list: async () => [
      { id: 1, url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/c56ca53b3_generated_98cbb3b3.png" },
      { id: 2, url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/9f922f07d_generated_8a79fa81.png" },
      { id: 3, url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/a8699792d_generated_52286c11.png" },
    ],
    filter: async () => [],
  },
  User: {
    list: async () => [],
    create: async (data) => ({ id: Math.random(), ...data }),
    filter: async () => [],
  }
};

export const base44 = {
  entities: mockData,
  auth: {
    login: async (email, password) => ({ 
      success: true, 
      user: { id: 1, email, name: "User" },
      token: "mock-token"
    }),
    register: async (data) => ({ 
      success: true, 
      user: { id: 1, ...data },
      token: "mock-token"
    }),
    logout: async () => ({ success: true }),
  }
};

// Mock functions for compatibility
export const checkUserAuth = async () => ({ authenticated: false });
export const checkAppPublicSettings = async () => ({ public_settings: {} });
export const createAxiosClient = (config) => ({
  get: async (url) => ({}),
  post: async (url, data) => ({}),
  put: async (url, data) => ({}),
  delete: async (url) => ({})
});
