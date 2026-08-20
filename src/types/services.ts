export type ServiceTierData = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
};

export type ServiceGroupData = {
  id: string;
  category: string;
  description: string;
  tiers: ServiceTierData[];
};
