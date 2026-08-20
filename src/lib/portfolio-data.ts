export type PortfolioCategory =
  | "Bodas y 15 Años"
  | "Retratos y Sesiones"
  | "Eventos Sociales"
  | "Deportes";

export const CATEGORIES: PortfolioCategory[] = [
  "Bodas y 15 Años",
  "Retratos y Sesiones",
  "Eventos Sociales",
  "Deportes",
];

export type PortfolioImage = {
  id: string;
  category: PortfolioCategory;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const PORTFOLIO_IMAGES: PortfolioImage[] = [
  { id: "w1", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2499.jpg", alt: "Quinceañera con vestido violeta y tiara", width: 3862, height: 5804 },
  { id: "w2", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2505.jpg", alt: "Retrato de quinceañera en set decorado con flores", width: 3862, height: 5804 },
  { id: "w3", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2521.jpg", alt: "Festejo de 15 años", width: 4024, height: 6048 },
  { id: "w4", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2590.jpg", alt: "Celebración de boda o 15 años", width: 4024, height: 6048 },
  { id: "w5", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2591.jpg", alt: "Momento especial de la celebración", width: 4024, height: 6048 },
  { id: "w6", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2592.jpg", alt: "Detalle de la fiesta", width: 4024, height: 6048 },
  { id: "w7", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2594.jpg", alt: "Quinceañera durante la celebración", width: 4024, height: 6048 },
  { id: "w8", category: "Bodas y 15 Años", src: "/portfolio/bodas-15/SQF_2607.jpg", alt: "Cierre de la celebración de 15 años", width: 4024, height: 6048 },

  { id: "p1", category: "Retratos y Sesiones", src: "/portfolio/retratos-sesiones/SQF_0874-ig.jpg", alt: "Retrato de estudio con torta de 15 años", width: 2000, height: 3006 },
  { id: "p2", category: "Retratos y Sesiones", src: "/portfolio/retratos-sesiones/SQF_1032-ig.jpg", alt: "Sesión de retrato en estudio", width: 2000, height: 3007 },
  { id: "p3", category: "Retratos y Sesiones", src: "/portfolio/retratos-sesiones/SQF_1246-ig.jpg", alt: "Retrato de estudio con fondo neutro", width: 2000, height: 3006 },
  { id: "p4", category: "Retratos y Sesiones", src: "/portfolio/retratos-sesiones/SQF_1276-ig.jpg", alt: "Sesión de fotos personalizada", width: 2000, height: 3006 },
  { id: "p5", category: "Retratos y Sesiones", src: "/portfolio/retratos-sesiones/SQF_1446-ig.jpg", alt: "Retrato artístico de estudio", width: 2000, height: 3006 },

  { id: "e1", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0349-Mejorado-NR.jpg", alt: "Ceremonia religiosa de boda", width: 3898, height: 2599 },
  { id: "e2", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0354-Mejorado-NR.jpg", alt: "Momento de la ceremonia", width: 3898, height: 2599 },
  { id: "e3", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0476-Mejorado-NR.jpg", alt: "Celebración social", width: 2505, height: 3758 },
  { id: "e4", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0489-Mejorado-NR.jpg", alt: "Evento social con invitados", width: 3669, height: 2446 },
  { id: "e5", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0491-Mejorado-NR.jpg", alt: "Detalle del evento", width: 3669, height: 2446 },
  { id: "e6", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0634-Mejorado-NR.jpg", alt: "Celebración familiar", width: 3669, height: 2446 },
  { id: "e7", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0645-Mejorado-NR.jpg", alt: "Momento de la fiesta", width: 3669, height: 2446 },
  { id: "e8", category: "Eventos Sociales", src: "/portfolio/eventos-sociales/_IMG0659-Mejorado-NR.jpg", alt: "Cierre del evento social", width: 3799, height: 2533 },

  { id: "s1", category: "Deportes", src: "/portfolio/deportes/SQF_7602.JPG", alt: "Jugadora de handball en cancha", width: 1363, height: 2048 },
  { id: "s2", category: "Deportes", src: "/portfolio/deportes/SQF_7640.JPG", alt: "Acción deportiva en cancha", width: 1365, height: 2048 },
  { id: "s3", category: "Deportes", src: "/portfolio/deportes/SQF_7650.JPG", alt: "Jugadora en pleno partido", width: 1365, height: 2048 },
  { id: "s4", category: "Deportes", src: "/portfolio/deportes/SQF_7677.JPG", alt: "Momento de juego", width: 1365, height: 2048 },
  { id: "s5", category: "Deportes", src: "/portfolio/deportes/SQF_7695.JPG", alt: "Deportista en competencia", width: 1363, height: 2048 },
  { id: "s6", category: "Deportes", src: "/portfolio/deportes/SQF_7716.JPG", alt: "Acción del partido", width: 1363, height: 2048 },
  { id: "s7", category: "Deportes", src: "/portfolio/deportes/SQF_7717.JPG", alt: "Jugadora en la cancha", width: 1363, height: 2048 },
  { id: "s8", category: "Deportes", src: "/portfolio/deportes/SQF_7725.JPG", alt: "Cierre de la jugada", width: 1363, height: 2048 },
];
