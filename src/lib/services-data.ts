export type ServiceTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export type ServiceGroup = {
  category: string;
  description: string;
  tiers: ServiceTier[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "Bodas",
    description: "Tres combos pensados para acompañar tu boda de principio a fin.",
    tiers: [
      {
        name: "Esencial",
        price: "$700",
        description: "Cobertura de la ceremonia, ideal para bodas íntimas.",
        features: [
          "4 horas de cobertura",
          "1 fotógrafo",
          "200 fotos editadas en alta resolución",
          "Galería digital privada",
          "Entrega en 15 días hábiles",
        ],
      },
      {
        name: "Clásico",
        price: "$1200",
        description: "Ceremonia y fiesta, la opción más elegida por las parejas.",
        features: [
          "8 horas de cobertura",
          "2 fotógrafos",
          "400+ fotos editadas en alta resolución",
          "Galería digital privada con descarga",
          "Entrega en 20 días hábiles",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "$1800",
        description: "Cobertura completa desde los preparativos hasta el final de la fiesta.",
        features: [
          "10-12 horas de cobertura",
          "2 fotógrafos",
          "600+ fotos editadas en alta resolución",
          "Álbum impreso premium",
          "USB personalizado",
          "Entrega en 25 días hábiles",
        ],
      },
    ],
  },
  {
    category: "15 Años",
    description: "Tres combos para celebrar el gran día de tu quinceañera.",
    tiers: [
      {
        name: "Esencial",
        price: "$500",
        description: "Cobertura de la fiesta, ideal para celebraciones más íntimas.",
        features: [
          "4 horas de cobertura",
          "1 fotógrafo",
          "150 fotos editadas en alta resolución",
          "Galería digital privada",
          "Entrega en 10 días hábiles",
        ],
      },
      {
        name: "Clásico",
        price: "$900",
        description: "Sesión previa + cobertura completa de la fiesta.",
        features: [
          "Sesión de fotos previa (1h)",
          "6 horas de cobertura de fiesta",
          "1-2 fotógrafos",
          "300+ fotos editadas en alta resolución",
          "Galería digital privada con descarga",
          "Entrega en 15 días hábiles",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "$1400",
        description: "Sesión temática previa y cobertura completa del evento.",
        features: [
          "Sesión temática previa (2h)",
          "8+ horas de cobertura de fiesta",
          "2 fotógrafos",
          "500+ fotos editadas en alta resolución",
          "Álbum impreso premium",
          "Entrega en 20 días hábiles",
        ],
      },
    ],
  },
  {
    category: "Retratos y Sesiones",
    description: "Tres combos para books personales, en pareja o familiares.",
    tiers: [
      {
        name: "Esencial",
        price: "$100",
        description: "Sesión corta, ideal para redes sociales o books simples.",
        features: [
          "45 minutos de sesión",
          "1 locación",
          "20 fotos editadas en alta resolución",
          "Galería digital privada",
          "Entrega en 5 días hábiles",
        ],
      },
      {
        name: "Clásico",
        price: "$180",
        description: "Sesión más extensa, con cambio de vestuario incluido.",
        features: [
          "1.5 horas de sesión",
          "1-2 locaciones",
          "1 cambio de vestuario",
          "40 fotos editadas en alta resolución",
          "Galería digital privada con descarga",
          "Entrega en 7 días hábiles",
        ],
        featured: true,
      },
      {
        name: "Premium",
        price: "$280",
        description: "Sesión completa en varias locaciones, con book impreso.",
        features: [
          "2-3 horas de sesión",
          "Múltiples locaciones",
          "2 cambios de vestuario",
          "60+ fotos editadas en alta resolución",
          "Book impreso",
          "Entrega en 10 días hábiles",
        ],
      },
    ],
  },
  {
    category: "Eventos Sociales",
    description: "Cumpleaños, aniversarios, lanzamientos y eventos corporativos.",
    tiers: [
      {
        name: "Cobertura de evento",
        price: "$400",
        description: "Un solo paquete flexible, ajustable a la duración de tu evento.",
        features: [
          "3 horas de cobertura",
          "150+ fotos editadas en alta resolución",
          "Galería digital privada",
          "Entrega en 10 días hábiles",
        ],
      },
    ],
  },
];
