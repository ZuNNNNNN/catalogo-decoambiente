/**
 * Configuración centralizada del sitio — Deco Ambiente & Hogar
 * Modifica este archivo para cambiar textos, datos de contacto, links y copys.
 */

// ─── Identidad ────────────────────────────────────────────────────────────────
export const SITE = {
  name: "Deco Ambiente",
  fullName: "Deco Ambiente & Hogar",
  tagline: "Piezas de autor para espacios que inspiran",
  description:
    "Descubre decoración exclusiva y mobiliario de diseño seleccionado para quienes valoran la belleza extraordinaria en cada detalle.",
  country: "Chile",
  currency: "CLP",
  locale: "es-CL",
};

// ─── Contacto ─────────────────────────────────────────────────────────────────
export const CONTACT = {
  phone: "+56 9 8765 4321",
  phoneRaw: "+56987654321",
  email: "hola@decoambiente.cl",
  address: "Av. Providencia 1234, Santiago, Chile",
  whatsapp: "56987654321",
  instagram: "https://instagram.com/decoambiente.cl",
  facebook: "https://facebook.com/decoambientecl",
  horarios: {
    semana: "Lun–Vie: 9:00 – 19:00",
    sabado: "Sáb: 10:00 – 15:00",
  },
};

// ─── WhatsApp helper ──────────────────────────────────────────────────────────
export const WHATSAPP_URL = (
  msg = "Hola, me contacto desde el sitio web y quisiera consultar sobre sus productos.",
) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;

// ─── Copys por sección ────────────────────────────────────────────────────────
export const COPY = {
  hero: {
    badge: "Colección exclusiva · Chile",
    title: "Tu hogar,",
    titleEm: "tu obra maestra",
    subtitle:
      "Descubre piezas únicas de decoración y mobiliario de autor, seleccionadas para quienes valoran la belleza extraordinaria en cada detalle.",
    ctaPrimary: "Ver Colección Completa",
    ctaSecondary: "Explorar Categorías",
    stats: [
      { value: "+500", label: "Piezas únicas" },
      { value: "+8", label: "Colecciones" },
      { value: "+1.200", label: "Hogares transformados" },
    ],
    floatingCard: {
      label: "Pieza del momento",
      name: "Sofá Riviera",
      price: "$1.890.000",
      sub: "Stock limitado",
    },
  },

  categories: {
    eyebrow: "Colecciones",
    title: "El ambiente que mereces,",
    titleEm: "en cada espacio",
    subtitle:
      "Desde el living hasta el jardín, cada rincón de tu hogar merece una pieza que lo haga único.",
    countSuffix: "piezas",
  },

  featured: {
    eyebrow: "Selección de autor",
    title: "Piezas destacadas",
    subtitle:
      "Una curaduría especial para quienes buscan lo extraordinario. Cada pieza, elegida por su diseño, calidad y carácter.",
    seeAll: "Ver colección completa",
    cta: "Ver detalle",
  },

  benefits: {
    eyebrow: "La diferencia Deco Ambiente",
    title: "Donde el diseño",
    titleEm: "se convierte en arte",
    subtitle:
      "Trabajamos con los más altos estándares para que cada pieza que llega a tu hogar sea tan extraordinaria como tú.",
  },

  testimonials: {
    eyebrow: "Experiencias reales",
    title: "Lo que dicen quienes ya transformaron su hogar",
  },

  cta: {
    eyebrow: "¿Listo para elevar tu espacio?",
    title: "Descubre la colección completa",
    titleEm: "y encuentra lo que mereces",
    subtitle:
      "Más de 500 piezas disponibles. Despacho a todo Chile. Asesoría personalizada sin costo.",
    ctaPrimary: "Ver Colección Completa",
    ctaWhatsapp: "Consultar con un asesor",
  },

  navbar: {
    cta: "Ver Colección",
    links: [
      { to: "/", label: "Inicio" },
      { to: "/catalogo", label: "Catálogo" },
      { to: "/nosotros", label: "Nosotros" },
      { to: "/contacto", label: "Contacto" },
    ],
  },

  footer: {
    tagline:
      "Piezas de autor para espacios que inspiran. Decoración exclusiva para el hogar chileno.",
    navTitle: "Navegación",
    categoriesTitle: "Colecciones",
    contactTitle: "Contacto",
    copyright: "Todos los derechos reservados.",
    categoriesLinks: [
      { to: "/catalogo?categoria=living", label: "Living" },
      { to: "/catalogo?categoria=dormitorio", label: "Dormitorio" },
      { to: "/catalogo?categoria=cocina", label: "Cocina" },
      { to: "/catalogo?categoria=jardin", label: "Jardín" },
      { to: "/catalogo?categoria=iluminacion", label: "Iluminación" },
    ],
  },

  nosotros: {
    eyebrow: "Nuestra historia",
    title: "Transformamos espacios,",
    titleEm: "creamos legados",
    subtitle:
      "Somos una casa de decoración especializada en piezas de diseño y artesanía de autor. Desde 2015 asesoramos a quienes buscan lo extraordinario para sus hogares.",
    values: [
      {
        title: "Curaduría de autor",
        desc: "Cada pieza de nuestra colección es seleccionada personalmente por nuestro equipo, garantizando que solo lo excepcional llegue a tu hogar.",
      },
      {
        title: "Materiales nobles",
        desc: "Priorizamos maderas nativas, textiles naturales y cerámicas artesanales. Belleza que respeta el origen de cada material.",
      },
      {
        title: "Excelencia garantizada",
        desc: "Trabajamos con los mejores artesanos nacionales e importadores especializados. Calidad que no admite términos medios.",
      },
      {
        title: "Asesoría exclusiva",
        desc: "Nuestro equipo te acompaña desde la primera consulta hasta la entrega, con atención dedicada y sin apuros.",
      },
    ],
    storyTitle: "Más de una década vistiendo los mejores hogares",
    storyP1:
      "Lo que comenzó como una pequeña galería de diseño en Providencia es hoy la primera elección de los interioristas más reconocidos de Chile. Fundada por Camila y Sofía, quienes viajan cada temporada a ferias de diseño en Europa y América Latina para traer lo más exclusivo.",
    storyP2:
      "Creemos que decorar no es un gasto sino una inversión en bienestar. Un espacio cuidadosamente compuesto eleva la calidad de vida, el ánimo y la identidad de quienes lo habitan.",
    quote:
      '"Cada rincón de tu hogar\nes una oportunidad para\nser extraordinario."',
    quoteAuthor: "— Camila & Sofía, fundadoras",
    stats: [
      { num: "+1.200", label: "clientes satisfechos" },
      { num: "+500", label: "piezas únicas" },
      { num: "10+", label: "años de excelencia" },
    ],
  },

  contacto: {
    eyebrow: "Estamos para ti",
    title: "Contáctanos",
    subtitle:
      "¿Tienes una consulta, deseas asesoría personalizada o quieres hacer un encargo especial? Escríbenos y respondemos el mismo día.",
    formTitle: "Envíanos un mensaje",
    formSubtitle: "Completa el formulario y te respondemos por WhatsApp.",
    fields: {
      nombre: "Tu nombre",
      nombrePlaceholder: "María González",
      email: "Email (opcional)",
      emailPlaceholder: "maria@email.com",
      mensaje: "¿En qué podemos ayudarte?",
      mensajePlaceholder:
        "Quisiera consultar sobre el sofá Riviera que vi en Instagram...",
    },
    submit: "Enviar por WhatsApp",
    note: "Al hacer clic se abrirá WhatsApp con tu mensaje pre-cargado.",
    successTitle: "¡Mensaje listo para enviar!",
    successDesc:
      "Se abrió WhatsApp con tu consulta. Si no se abrió automáticamente, escríbenos directamente.",
    successReset: "Nueva consulta",
  },
};
