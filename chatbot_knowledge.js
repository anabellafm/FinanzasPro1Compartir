/**
 * BASE DE CONOCIMIENTOS - ASISTENTE FINANZAS PRO
 * 
 * Este archivo contiene las respuestas del chatbot. 
 * Puedes editar los textos para personalizar lo que responde el asistente.
 * 
 * ESTRUCTURA:
 * "palabra_clave": "Respuesta que dará el bot"
 */

window.CHATBOT_KNOWLEDGE = {
    // Conceptos Generales de la App
    "hola": "¡Hola! Soy tu asistente de Finanzas Pro. Estoy aquí para ayudarte a dominar tus números y alcanzar la libertad financiera. ¿Qué quieres saber hoy? (Ej: 'metas', 'coach', 'xp')",

    "ayuda": "Puedo explicarte cómo funcionan las siguientes secciones:<br>• <b>Metas</b>: Ahorro con propósito.<br>• <b>Coach</b>: Análisis de tus hábitos.<br>• <b>XP</b>: Gamificación y progreso.<br>• <b>Margen Libre</b>: Tu capacidad real de gasto.<br>¿Sobre cuál prefieres que profundicemos?",

    // Sección de Metas / Objetivos
    "metas": "En la sección de <b>Objetivos Financieros</b>, puedes crear metas con plazos y prioridades.<br><br>• <b>Prioridades (P1, P2...)</b>: El sistema llena primero las metas P1 con tu superávit mensual.<br>• <b>Plan de Ahorro</b>: Puedes definir un % de tus ingresos o un monto fijo.<br>• <b>Viabilidad</b>: Si la barra se pone roja, significa que no llegarás a tiempo con tu ritmo actual.",
    "objetivos": "Los objetivos son el 'por qué' de tu ahorro. El Dashboard calculará automáticamente cuánto necesitas separar cada día o mes para llegar a la fecha límite que definas.",

    // Coach Financiero
    "coach": "El <b>Coach Financiero</b> es un motor de análisis que observa tus transacciones. <br><br>Te dará alertas si estás gastando demasiado en categorías variables o si tu superávit es menor al compromiso de tus metas. Es como un mentor que te mantiene en el camino correcto.",

    // Gamificación / XP
    "xp": "El sistema de <b>Experiencia (XP)</b> premia tu disciplina financiera.<br><br>• <b>Ganas XP por</b>: Registrar gastos diariamente, completar metas, mantener balance positivo.<br>• <b>Niveles</b>: Empiezas como 'Novato' y puedes subir hasta 'Maestro de la Libertad'. Cada nivel desbloquea nuevas insignias en tu perfil.",
    "experiencia": "La experiencia mide tu constancia. No se trata de cuánto dinero tienes, sino de qué tan bien lo gestionas.",
    "logros": "Haz clic en 🎖️ <b>Ver Logros</b> en el sidebar para ver tus medallas. Cada una representa un hito superado, como 'Ahorrador Constante' o 'Dominio del Dólar'.",

    // Conceptos Financieros Técnicos de la App
    "margen libre": "El <b>Margen Libre</b> es el dato más importante. <br><br>Representa el dinero que realmente te queda disponible después de restar tus gastos proyectados y tus compromisos de ahorro del mes. Si es positivo, ¡vas por buen camino! Si es negativo, estás sobre-comprometido.",
    "compromisos": "Los compromisos son el dinero que ya 'prometiste' a tus metas de ahorro. El Monitor de Compromisos te muestra qué porcentaje de tus ingresos ya tiene un destino claro antes de que lo gastes.",

    // Transacciones y Categorías
    "transacciones": "Puedes registrar ingresos o egresos. Te recomiendo usar <b>Categorías</b> precisas para que el Coach pueda darte mejores consejos. Los movimientos 'Fijos' se repiten mentalmente en el análisis del Coach cada mes.",
    "categorias": "Las categorías clasifican tu vida. Puedes administrarlas desde el icono ⚙️ en el sidebar. El gráfico de torta te mostrará en qué se va la mayor parte de tu presupuesto.",

    // Monedas y Dolarización
    "dolar": "Esta app es <b>Multimoneda</b>. Puedes registrar dólares (USD), Euros (EUR) o Cripto (USDT/USDC). El sistema convertirá todo a tu moneda local para darte un Balance Total unificado.",
    "monedas": "Configura tus cotizaciones en el sidebar. Puedes 'Bloquear' el candado para que los precios no cambien automáticamente si manejas efectivo propio a una tasa fija.",

    // Coaching de Propósito y Vida
    "proposito": "Tu propósito es el motor de tu riqueza. El ahorro no es acumular dinero, es comprar libertad y tiempo para dedicarte a lo que realmente te apasiona. El dinero es una herramienta, tu propósito es el destino.",
    "analiza": "Analizar es el primer paso para mejorar. Tus números te dicen la verdad sobre tus hábitos actuales. Revisa tu 'Margen Libre' para ver qué tan alineados están tus gastos con tus objetivos a largo plazo.",
    "consejo": "Mi mejor consejo: Págate a ti mismo primero. Automatiza el ahorro para tus objetivos prioritarios y vive con el resto. Ese es el camino más seguro hacia la paz mental y la riqueza generacional.",
    "vida": "Una vida rica no es la que más gasta, sino la que tiene más opciones. Manejar bien tus finanzas hoy te da el increíble poder de elegir deliberadamente cómo vivir tu vida mañana.",
    "futuro": "El futuro se construye hoy. Cada pequeña decisión financiera (incluso un egreso menor) es un voto por el tipo de futuro que quieres experimentar.",
    "dispositivo": "¡Es muy fácil! Como tus datos son privados y se guardan solo en este navegador, para verlos en otro equipo debes:<br><br>1. En tu aparato actual, ve a la barra lateral (Mis Datos) y pulsa <b>'Guardar Copia'</b>.<br>2. Se descargará un archivo .json. Envíatelo a tu nuevo equipo (por Mail o WhatsApp).<br>3. En el nuevo aparato, abre la app y pulsa <b>'Subir Copia'</b> para cargar ese archivo.<br><br><b>¿Cuándo hacerlo?</b> Hazlo antes de cambiar de celular, semanalmente por seguridad o si piensas limpiar el historial de tu navegador.",
    "sincronizar": "La sincronización es manual para proteger tu privacidad. Te recomiendo descargar tu <b>'Copia de Seguridad'</b> semanalmente. Es vital hacerlo antes de formatear tu equipo o si vas a empezar a usar la app en una computadora nueva.",
    "datos": "¡Tus datos son sagrados! Por eso se guardan exclusivamente en tu navegador (LocalStorage). Nadie más puede verlos. Como no hay una base de datos central, tú eres el guardián de tu información. ¡Usa el botón <b>'Guardar Copia'</b> a menudo!",

    // Errores o Desconocido (Fallback)
    "fallback": "Lo siento, no tengo esa información específica. Prueba preguntando por <b>'metas'</b>, <b>'coach'</b> o <b>'margen libre'</b>. También recuerda que cada sección tiene un icono de ❔ con explicaciones detalladas."
};
