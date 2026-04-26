/* ============================================================
   ANALYTICS BÁSICO (mock — reemplazar con GA4 / Plausible)
   ============================================================ */
const analytics = {
  events: [],
  track(event, data = {}) {
    const entry = { event, data, ts: new Date().toISOString() };
    this.events.push(entry);
    console.info('[F1Social Analytics]', entry);
    // Reemplaza la siguiente línea con tu GA4 gtag() o Plausible window.plausible()
    // gtag('event', event, data);
  }
};
function trackDownload(source) {
  try { analytics.track('apk_download_click', { source }); } catch(e) {}
  // Incrementar contador visual
  const el = document.getElementById('dl-count');
  if (el) {
    const current = parseInt(el.textContent.replace(/,/g, ''));
    animateCount(el, current, current + 1);
  }
  window.location.href = 'f1social-v1.0.apk';
}

/* ============================================================
   CONTADOR ANIMADO
   ============================================================ */
function animateCount(el, from, to, duration = 800) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(from + (to - from) * progress);
    el.textContent = value.toLocaleString('es-MX');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Animar el contador al entrar en viewport
const dlCountEl = document.getElementById('dl-count');
if (dlCountEl) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(dlCountEl, 0, 11, 1500);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(dlCountEl);
}

/* ============================================================
   DIAGRAMA DE PRODUCTO — ZOOM & DRAG
   ============================================================ */
let pdScale = 1;
const pdCanvas = document.getElementById('pd-canvas');
const pdViewport = document.getElementById('pd-viewport');

function pdZoom(delta) {
  pdScale = Math.max(0.4, Math.min(2, pdScale + delta));
  pdCanvas.style.transform = `scale(${pdScale})`;
  document.getElementById('pd-zoom-label').textContent = Math.round(pdScale * 100) + '%';
}
function pdReset() {
  pdScale = 1;
  pdCanvas.style.transform = 'scale(1)';
  document.getElementById('pd-zoom-label').textContent = '100%';
  pdViewport.scrollTo(0, 0);
}
function pdFullscreen() {
  if (pdViewport.requestFullscreen) pdViewport.requestFullscreen();
}

// Drag to scroll
if (pdViewport) {
  let isDown = false, startX, startY, scrollLeft, scrollTop;
  pdViewport.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - pdViewport.offsetLeft;
    startY = e.pageY - pdViewport.offsetTop;
    scrollLeft = pdViewport.scrollLeft;
    scrollTop = pdViewport.scrollTop;
  });
  pdViewport.addEventListener('mouseleave', () => isDown = false);
  pdViewport.addEventListener('mouseup', () => isDown = false);
  pdViewport.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    pdViewport.scrollLeft = scrollLeft - (e.pageX - pdViewport.offsetLeft - startX);
    pdViewport.scrollTop = scrollTop - (e.pageY - pdViewport.offsetTop - startY);
  });
}
function toggleFaq(questionEl) {
  const item = questionEl.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ============================================================
   GALERÍA — TABS
   ============================================================ */
function switchTab(name, btn) {
  document.querySelectorAll('.gallery-group').forEach(g => g.classList.remove('active'));
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

/* ============================================================
   GALERÍA — LIGHTBOX
   ============================================================ */
const screenData = [
  { title: 'Splash Screen',          desc: 'Pantalla inicial con el logo de F1Social al abrir la app.' },
  { title: 'Animación de Entrada',   desc: 'Splash screen con el coche de F1 acercándose en animación.' },
  { title: 'Welcome Screen',         desc: 'Pantalla de bienvenida con botones para Iniciar Sesión o Crear Cuenta.' },
  { title: 'Iniciar Sesión',         desc: 'Formulario de login con email y contraseña. Soporte para Google y Apple.' },
  { title: 'Crear Cuenta',           desc: 'Formulario de registro con email y contraseña.' },
  { title: 'Términos & Privacidad',  desc: 'Pantalla de aceptación de términos de uso y política de privacidad.' },
  { title: 'Tu Perfil',              desc: 'Personalización: nombre, nombre de usuario, descripción y foto de perfil.' },
  { title: 'Elige tu Piloto',        desc: 'Selección del piloto favorito para personalizar el feed.' },
  { title: 'Elige tu Escudería',     desc: 'Selección de la escudería favorita para unirte a su comunidad.' },
  { title: 'Circuito Favorito',      desc: 'Selección del Gran Premio o circuito favorito.' },
  { title: 'Tipo de Contenido',      desc: '¿Qué contenido quieres ver más? Videos, telemetría, debates...' },
  { title: 'Tu Era F1',              desc: '¿Con qué era de la Fórmula 1 te identificas más?' },
  { title: 'Notificaciones',         desc: 'Configura qué notificaciones quieres recibir.' },
  { title: '¡Registro Completo!',    desc: 'Pantalla de confirmación — tu cuenta está lista.' },
  { title: 'Feed Principal',         desc: 'Feed de videos al estilo TikTok con contenido de la comunidad F1.' },
  { title: 'Subir Video / Foto',     desc: 'Acceso a cámara para grabar video o tomar foto directamente.' },
  { title: 'Nueva Publicación',      desc: 'Editor de publicación: descripción, música, lugar y más.' },
  { title: 'Comunidades — Equipos',  desc: 'Vista de las 11 comunidades por escudería.' },
  { title: 'Sección Pilotos',        desc: 'Dentro de una comunidad: posts y contenido de los pilotos del equipo.' },
  { title: 'Sección Fans',           desc: 'Dentro de una comunidad: publicaciones de los fans del equipo.' },
  { title: 'Trivia del Equipo',      desc: 'Preguntas de trivia exclusivas de la escudería para ganar XP.' },
  { title: 'Novedades',              desc: 'Últimas noticias y novedades de la temporada.' },
  { title: 'Ligas',                  desc: 'Tabla de clasificación semanal y global por puntos XP.' },
  { title: 'Estadísticas — Pilotos', desc: 'Clasificación actual de pilotos en el campeonato.' },
  { title: 'Detalle de Piloto',      desc: 'Estadísticas completas y descripción del piloto seleccionado.' },
  { title: 'Constructores',          desc: 'Clasificación de constructores en el campeonato.' },
  { title: 'Calendario',             desc: 'Calendario completo de Grandes Premios de la temporada.' },
  { title: 'Resultado de Carrera',   desc: 'Posiciones finales y tiempos de una carrera ya disputada.' },
  { title: 'Gráfica de Puntos',      desc: 'Evolución de puntos de pilotos a lo largo de la temporada.' },
  { title: 'Comparador',             desc: 'Comparador de estadísticas entre dos pilotos.' },
  { title: 'Mi Perfil',              desc: 'Perfil del usuario: XP, liga, publicaciones y estadísticas.' },
  { title: 'Editar Perfil',          desc: 'Edición de nombre, foto, descripción y preferencias.' },
  { title: 'Configuración',          desc: 'Menú lateral: Actividad, Cuenta, Preferencias y Notificaciones.' },
  { title: 'Admin Dashboard',        desc: 'Panel de administración: estadísticas generales y acciones rápidas.' },
  { title: 'Admin Pendientes',       desc: 'Contenido pendiente de moderación y aprobación.' },
  { title: 'Admin Usuarios',         desc: 'Gestión de usuarios: Fans, Escuderías y Pilotos verificados.' },
  { title: 'Admin Contenido',        desc: 'Moderación y gestión del contenido publicado en la plataforma.' },
];

let currentScreen = 1;

function openLightbox(num) {
  currentScreen = num;
  updateLightbox();
  document.getElementById('gallery-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const data = screenData[currentScreen - 1];
  document.getElementById('glb-img').src = 'cap/' + currentScreen + '.png';
  document.getElementById('glb-img').alt = data.title;
  document.getElementById('glb-num').textContent = 'PANTALLA ' + String(currentScreen).padStart(2,'0') + ' / 37';
  document.getElementById('glb-title').textContent = data.title;
  document.getElementById('glb-desc').textContent = data.desc;
}

function lightboxNav(dir) {
  currentScreen = Math.max(1, Math.min(37, currentScreen + dir));
  updateLightbox();
}

function closeLightboxBtn() {
  document.getElementById('gallery-lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightbox(e) {
  if (e.target === document.getElementById('gallery-lightbox')) closeLightboxBtn();
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('gallery-lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'Escape') closeLightboxBtn();
});

/* ============================================================
   HEADER SCROLL + LOGO PARALLAX
   ============================================================ */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.classList.toggle('scrolled', window.scrollY > 30);

  // Scroll progress
  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scroll-progress').style.width = scrollPct + '%';

  // Logo parallax — se acerca al hacer scroll, regresa al subir
  const heroLogo = document.getElementById('hero-logo');
  if (heroLogo) {
    const heroSection = document.getElementById('hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    const progress = Math.min(window.scrollY / heroHeight, 1);
    const scale = 1 + progress * 0.5; // crece hasta 1.5x
    heroLogo.style.transform = `scale(${scale})`;
    heroLogo.style.opacity = 1 - progress * 0.3; // se desvanece levemente
  }
});

/* ============================================================
   HAMBURGER / MOBILE NAV
   ============================================================ */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.add('open');
  analytics.track('mobile_nav_open');
});
document.getElementById('mobile-close').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.remove('open');
});
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobile-nav').classList.remove('open'));
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================================
   MANUAL DATA
   ============================================================ */
const chapters = [
  {
    id: 'ch1', num: '01', title: 'Descripción General',
    content: `
      <h3>Descripción <span style="color:var(--accent-red)">General</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 1</span><span>Visión del producto</span></div>
      <p><strong>F1Social</strong> es una aplicación móvil multiplataforma desarrollada con Flutter, concebida como una red social temática exclusiva para aficionados a la Fórmula 1. Integra contenido generado por usuarios (vídeos cortos al estilo TikTok), datos en tiempo real de sesiones de carrera, comunidades organizadas por escudería, estadísticas oficiales de la temporada y un sistema de gamificación basado en puntos de experiencia (XP).</p>
      <p>A diferencia de las redes sociales generalistas, F1Social concentra toda la experiencia en torno al ecosistema de la Fórmula 1: pilotos, escuderías, grandes premios y telemetría en vivo.</p>
      <h4>Objetivos del Sistema</h4>
      <ul>
        <li><strong>Objetivo principal:</strong> Espacio digital centralizado donde los fans de la F1 interactúan, comparten contenido y consumen información en tiempo real.</li>
        <li><strong>Objetivo técnico:</strong> Demostrar la viabilidad de una arquitectura Flutter + Firebase para una app social con tiempo real, moderación de contenido y gamificación.</li>
        <li><strong>Objetivo académico:</strong> Aplicar conocimientos de desarrollo móvil, bases de datos NoSQL, servicios en la nube y seguridad de aplicaciones.</li>
      </ul>
      <h4>Público Objetivo</h4>
      <ul>
        <li>Fans casuales de la F1 que desean consumir contenido de forma entretenida y social.</li>
        <li>Aficionados avanzados interesados en telemetría, tiempos de vuelta y datos técnicos en vivo.</li>
        <li>Creadores de contenido del nicho F1 que buscan una plataforma especializada.</li>
        <li>Pilotos y escuderías que deseen interactuar con su base de fans mediante cuentas verificadas.</li>
      </ul>
      <div class="info-grid">
        <div class="info-card"><div class="info-card-label">Edad objetivo</div><div class="info-card-value">16 años o más</div></div>
        <div class="info-card"><div class="info-card-label">Plataformas</div><div class="info-card-value">Android &amp; iOS</div></div>
        <div class="info-card"><div class="info-card-label">Versión</div><div class="info-card-value">1.0.0 — Abril 2026</div></div>
        <div class="info-card"><div class="info-card-label">minSdk Android</div><div class="info-card-value">SDK 24 (Android 7.0)</div></div>
      </div>
    `
  },
  {
    id: 'ch2', num: '02', title: 'Justificación de Herramientas',
    content: `
      <h3>Justificación de <span style="color:var(--accent-red)">Herramientas</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 2</span><span>Stack tecnológico justificado</span></div>
      <p>La elección de herramientas se basó en criterios de rendimiento, integración, ecosistema y viabilidad para el contexto académico del proyecto.</p>
      <h4>Flutter / Dart</h4>
      <p>Flutter permite compilar una única base de código a aplicaciones nativas para Android e iOS. La compilación AOT (Ahead-of-Time) elimina el puente JavaScript que penaliza el rendimiento en React Native, siendo crítico para el feed de vídeos a 60 fps. El widget tree propio garantiza consistencia visual entre plataformas.</p>
      <ul>
        <li><strong>SDK Dart:</strong> ^3.11.4 con null safety estricto</li>
        <li><strong>Hot Reload:</strong> cambios en UI en menos de 1 segundo</li>
        <li><strong>APK resultante:</strong> ~69 MB con ofuscación</li>
        <li><strong>Alternativas evaluadas:</strong> React Native, Ionic, Xamarin — descartadas por overhead JS o rendimiento inferior</li>
      </ul>
      <h4>Firebase (Suite Completa)</h4>
      <ul>
        <li><strong>firebase_core ^3.6.0:</strong> Inicialización base, configura google-services.json y GoogleService-Info.plist</li>
        <li><strong>firebase_auth ^5.3.1:</strong> Autenticación Email, Google OAuth y Apple Sign-In</li>
        <li><strong>cloud_firestore ^5.4.4:</strong> Base de datos NoSQL con sincronización en tiempo real via Streams</li>
        <li><strong>firebase_messaging ^15.1.3:</strong> Push notifications con topics por equipo y piloto favorito</li>
        <li><strong>firebase_storage ^12.3.2:</strong> Almacenamiento de imágenes de perfil</li>
      </ul>
      <h4>Cloudinary</h4>
      <p>Plataforma de gestión de medios con CDN global. Los vídeos se suben directamente desde el cliente mediante upload preset sin firma, reduciendo la latencia. Genera thumbnails automáticos y optimiza formato (H.264, VP9, AV1) según dispositivo y conexión.</p>
      <h4>OpenF1 API</h4>
      <p>API pública y gratuita de telemetría F1. URL base: <code style="background:var(--bg-dark);padding:2px 6px;border-radius:3px;font-size:12px">https://api.openf1.org/v1/</code>. No requiere autenticación. Ofrece 11 endpoints utilizados: sessions, position, drivers, laps, pit, weather, race_control, intervals, team_radio, car_data, location.</p>
    `
  },
  {
    id: 'ch3', num: '03', title: 'Arquitectura del Sistema',
    content: `
      <h3>Arquitectura del <span style="color:var(--accent-red)">Sistema</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 3</span><span>Diseño técnico de alto nivel</span></div>
      <p>F1Social sigue una arquitectura cliente-servidor donde el cliente Flutter se comunica con Firebase mediante SDKs nativos (no HTTP directo), y con OpenF1 mediante peticiones HTTP REST.</p>
      <h4>Flujo de Datos Principal</h4>
      <ul>
        <li>El usuario abre la app → firebase_auth verifica la sesión activa</li>
        <li>Con sesión, se carga el perfil desde Firestore y se inicializa FCM</li>
        <li>El feed se suscribe a un Stream&lt;QuerySnapshot&gt; que actualiza la UI en tiempo real</li>
        <li>Al entrar al Modo En Vivo, OpenF1Service realiza polling periódico (posiciones: 2s, telemetría: 5s)</li>
        <li>Los vídeos subidos van a Cloudinary; la URL se guarda en Firestore con status 'pending'</li>
        <li>El admin aprueba desde el panel; el status cambia a 'approved' y aparece en el feed</li>
      </ul>
      <h4>Estructura de Archivos</h4>
      <div class="code-block"><span class="comment">social/</span>
├── lib/
│   ├── <span class="keyword">main.dart</span>         <span class="comment">(~17,400 líneas — UI + presentación)</span>
│   └── <span class="keyword">firebase_service.dart</span> <span class="comment">(~1,607 líneas — servicios)</span>
│
├── android/
│   ├── app/build.gradle.kts  <span class="comment">(compileSdk 36, minSdk 24)</span>
│   └── google-services.json  <span class="comment">(config Firebase Android)</span>
│
├── ios/
│   └── GoogleService-Info.plist
│
├── assets/
│   ├── pilotos/              <span class="comment">(22 imágenes PNG 2025)</span>
│   └── escuderias/           <span class="comment">(11 imágenes PNG/JPG)</span>
│
└── functions/
    └── index.js              <span class="comment">(Cloud Functions — pendiente)</span></div>
      <h4>Patrón de Diseño</h4>
      <p>Servicios estáticos (AuthService, FirestoreService, NotificationService, etc.) que encapsulan la lógica de acceso a datos. La UI consume estos servicios mediante FutureBuilder y StreamBuilder. Identificado para refactorización futura hacia BLoC, Riverpod o Provider.</p>
    `
  },
  {
    id: 'ch4', num: '04', title: 'Base de Datos Firestore',
    content: `
      <h3>Base de Datos <span style="color:var(--accent-red)">Firestore</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 4</span><span>Estructura de colecciones NoSQL</span></div>
      <p>Cloud Firestore es una base de datos NoSQL orientada a documentos. Aunque no existe un esquema rígido, F1Social define una estructura de datos consistente en todas sus colecciones.</p>
      <h4>Colección: users/{uid}</h4>
      <div class="code-block"><span class="keyword">users</span>/{uid}
├── uid, name, nameLower, username, usernameLower
├── email, bio, favoriteTeam, favoritePilot
├── followers, following, videosCount
├── xp, weeklyXp
├── <span class="string">role</span>: 'user' | 'verified_driver' | 'verified_team' | 'admin'
├── fcmToken, lastPostAt, banned, deleted
├── <span class="comment">// Subcolecciones:</span>
├── /notifications/{notifId}   <span class="comment">— tipo, origen, leído</span>
├── /following/{targetUid}     <span class="comment">— usuarios seguidos</span>
└── /xpHistory/{historyId}     <span class="comment">— historial de XP</span></div>
      <h4>Colección: videos/{videoId}</h4>
      <div class="code-block"><span class="keyword">videos</span>/{videoId}
├── videoUrl (Cloudinary), description, hashtags, team
├── likes, comments, views, score
├── <span class="string">status</span>: 'pending' | 'approved' | 'rejected'
├── moderationReason, moderationConfidence
├── /likes/{uid}               <span class="comment">— toggle likes</span>
└── /comments/{commentId}      <span class="comment">— con sub-likes</span></div>
      <h4>Otras Colecciones</h4>
      <ul>
        <li><strong>driver_posts/{postId}:</strong> Posts de pilotos/escuderías verificadas con badge</li>
        <li><strong>communities/{team}/posts/{postId}:</strong> Posts de fans por escudería</li>
        <li><strong>liveChat/{sessionKey}/messages/{messageId}:</strong> Chat en vivo sincronizado</li>
        <li><strong>predictions/{raceId}/votes/{uid}:</strong> Predicciones por GP con resultados</li>
        <li><strong>sessionReminders/{reminderId}:</strong> Recordatorios para Cloud Functions</li>
      </ul>
    `
  },
  {
    id: 'ch5', num: '05', title: 'Servicios Implementados',
    content: `
      <h3>Servicios <span style="color:var(--accent-red)">Implementados</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 5</span><span>firebase_service.dart — ~1,607 líneas</span></div>
      <p>Todos los servicios se encuentran en <code style="background:var(--bg-dark);padding:2px 6px;border-radius:3px;font-size:12px">lib/firebase_service.dart</code> y utilizan métodos estáticos para simplificar su consumo desde la UI.</p>
      <div class="info-grid">
        <div class="info-card"><div class="info-card-label">AuthService</div><div class="info-card-value">Email, Google, Apple</div></div>
        <div class="info-card"><div class="info-card-label">FirestoreService</div><div class="info-card-value">CRUD + streams</div></div>
        <div class="info-card"><div class="info-card-label">NotificationService</div><div class="info-card-value">FCM + topics</div></div>
        <div class="info-card"><div class="info-card-label">LiveChatService</div><div class="info-card-value">Chat en vivo RT</div></div>
        <div class="info-card"><div class="info-card-label">PredictionService</div><div class="info-card-value">5 preguntas / GP</div></div>
        <div class="info-card"><div class="info-card-label">XpService</div><div class="info-card-value">7 ligas + ranking</div></div>
        <div class="info-card"><div class="info-card-label">VisionModerationService</div><div class="info-card-value">SafeSearch auto</div></div>
        <div class="info-card"><div class="info-card-label">OpenF1Service</div><div class="info-card-value">11 endpoints</div></div>
      </div>
      <h4>XpService — Recompensas</h4>
      <table class="xp-table">
        <thead><tr><th>Acción</th><th>XP</th></tr></thead>
        <tbody>
          <tr><td>Dar like a un vídeo o post</td><td>+2 XP</td></tr>
          <tr><td>Comentar en un vídeo o post</td><td>+5 XP</td></tr>
          <tr><td>Publicar vídeo, post o thread</td><td>+8 XP</td></tr>
          <tr><td>Participar en predicciones</td><td>+10 XP</td></tr>
          <tr><td>Acertar una predicción</td><td>+50 XP</td></tr>
        </tbody>
      </table>
      <h4>VisionModerationService</h4>
      <p>Analiza thumbnails de Cloudinary con SafeSearch Detection (adult, violence, racy, medical, spoof). Si alguna categoría supera el umbral <strong>LIKELY</strong>, el vídeo se rechaza automáticamente. El contenido que pasa SafeSearch queda en 'pending' para revisión manual del administrador.</p>
    `
  },
  {
    id: 'ch6', num: '06', title: 'Funcionalidades Principales',
    content: `
      <h3>Funcionalidades <span style="color:var(--accent-red)">Principales</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 6</span><span>7 módulos funcionales</span></div>
      <h4>6.1 Feed de Vídeos (TikTok-style)</h4>
      <p>PageView vertical con VideoPlayerController por página. Pausa automática al cambiar de video. Reproducción en bucle. StreamBuilder suscrito a getApprovedFeed(). Mock videos como fallback. Algoritmo de score (likes + comentarios).</p>
      <h4>6.2 Modo En Vivo</h4>
      <p>Mapa 2D del circuito con coches posicionados via coordenadas GPS OpenF1. Tabla de posiciones con gaps. Panel de telemetría por piloto (velocidad, RPM, DRS, freno, acelerador). Mensajes de race_control. Radio de equipo con just_audio. Chat integrado con Firestore.</p>
      <h4>6.3 Comunidades por Equipo</h4>
      <p>11 escuderías, cada una con 3 tabs: Piloto (posts verificados), Fans (posts de comunidad) e Hilos (fan threads globales). Rate limiting de 10 segundos. Roles con badge de verificación. Admin puede eliminar cualquier post.</p>
      <h4>6.4 Estadísticas F1</h4>
      <p>Clasificación de pilotos y constructores. Calendario de GPs con cuenta regresiva. Gráfica de evolución de puntos con fl_chart (hasta 3 pilotos). Comparador de pilotos: victorias, podios, poles, vueltas rápidas, puntos.</p>
      <h4>6.5 Predicciones</h4>
      <p>5 preguntas por GP: ganador, pole, safety car, vuelta rápida, abandonos. Votación única. Gráfica de barras de distribución de votos. Revelación animada post-carrera. +10 XP por participar, +50 XP por acierto.</p>
      <h4>6.7 Panel de Administración</h4>
      <p>Acceso via role='admin' en Firestore. Dashboard con stats en tiempo real. Moderación de contenido (aprobar/rechazar con motivo). Gestión de usuarios en 3 tabs (Fans, Pilotos, Escuderías). Verificación de pilotos con selector de equipo.</p>
    `
  },
  {
    id: 'ch7', num: '07', title: 'Seguridad',
    content: `
      <h3>Seguridad <span style="color:var(--accent-red)">Implementada</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 7</span><span>5 capas de seguridad</span></div>
      <h4>7.1 Autenticación</h4>
      <ul>
        <li><strong>Validación de email:</strong> Expresión regular RFC 5322 antes de enviar a Firebase</li>
        <li><strong>Política de contraseñas:</strong> Mín. 8 chars, mayúscula, número, símbolo especial</li>
        <li><strong>Indicador de fortaleza:</strong> Barra en tiempo real (rojo → amarillo → verde)</li>
        <li><strong>Confirmación de contraseña:</strong> Campo doble con validación en tiempo real</li>
        <li><strong>Bloqueo por intentos:</strong> 3 intentos fallidos → diálogo de recuperación automático</li>
      </ul>
      <h4>7.2 Almacenamiento Seguro</h4>
      <p><strong>Android:</strong> EncryptedSharedPreferences con AES-256-GCM. Clave almacenada en Android Keystore (TEE). <strong>iOS:</strong> Keychain del sistema con accesibilidad first_unlock. <strong>API Keys:</strong> Archivo .env excluido del repositorio via .gitignore.</p>
      <h4>7.3 Rate Limiting</h4>
      <p>Cooldown de 10 segundos entre publicaciones, almacenado en el campo lastPostAt de Firestore. SpamException personalizada con mensaje de segundos restantes. Aplica a: comentarios, posts de comunidad, fan threads, posts de piloto y mensajes de chat.</p>
      <div class="code-block"><span class="keyword">const int</span> _kPostCooldownSecs = <span class="string">10</span>;
<span class="keyword">if</span> (elapsed &lt; _kPostCooldownSecs) {
  <span class="keyword">throw</span> <span class="string">SpamException</span>(
    <span class="string">'Espera $remaining segundo(s) antes de publicar.'</span>
  );
}</div>
      <h4>7.4 Moderación de Contenido</h4>
      <p>Google Cloud Vision API analiza thumbnails. SafeSearch evalúa: adult, violence, racy, medical, spoof. Umbral: LIKELY o superior → rechazo automático. Verificación de relevancia F1 mediante labels y logos detectados.</p>
      <h4>7.5 Validaciones de Entrada</h4>
      <ul>
        <li>Queries de búsqueda: máximo 100 caracteres, convertidas a minúsculas</li>
        <li>Manejo tipado de errores: SpamException, FirebaseAuthException con códigos específicos</li>
        <li>AppLogger centralizado con envío a Firebase Crashlytics en producción</li>
      </ul>
    `
  },
  {
    id: 'ch8', num: '08', title: 'Análisis Temporal',
    content: `
      <h3>Análisis <span style="color:var(--accent-red)">Temporal</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 9</span><span>Estimaciones vs. tiempo real</span></div>
      <p>El proyecto se completó con una desviación de aproximadamente 3 semanas respecto a la estimación inicial (+43%). Las principales causas de desviación fueron la integración con OpenF1, el Modo En Vivo, la seguridad y la fase de testing.</p>
      <table class="xp-table">
        <thead><tr><th>Fase</th><th>Estimado</th><th>Real</th></tr></thead>
        <tbody>
          <tr><td>Planificación y diseño UI/UX</td><td>1 sem</td><td>1.5 sem</td></tr>
          <tr><td>Arquitectura Firebase</td><td>3 días</td><td>4 días</td></tr>
          <tr><td>Autenticación (Email, Google, Apple)</td><td>2 días</td><td>3 días</td></tr>
          <tr><td>Feed de vídeos TikTok-style</td><td>1 sem</td><td>1.5 sem</td></tr>
          <tr><td>Estadísticas F1 + OpenF1</td><td>1 sem</td><td>2 sem</td></tr>
          <tr><td>Comunidades por equipo</td><td>4 días</td><td>5 días</td></tr>
          <tr><td>Modo En Vivo (mapa + telemetría)</td><td>1 sem</td><td>1.5 sem</td></tr>
          <tr><td>Panel de administración</td><td>3 días</td><td>4 días</td></tr>
          <tr><td>Seguridad (rate limiting, moderación)</td><td>3 días</td><td>5 días</td></tr>
          <tr><td>Predicciones + Ligas de fans</td><td>1 sem</td><td>1 sem</td></tr>
          <tr><td>Testing, corrección y QA</td><td>3 días</td><td>1 sem</td></tr>
          <tr><td>Documentación técnica</td><td>2 días</td><td>2 días</td></tr>
        </tbody>
      </table>
      <h4>Cuellos de Botella Identificados</h4>
      <ul>
        <li><strong>OpenF1 API:</strong> Documentación incompleta que requirió ingeniería inversa de endpoints</li>
        <li><strong>Modo En Vivo:</strong> Sincronización de múltiples streams simultáneos sin degradar 60 fps</li>
        <li><strong>Rate limiting sin Cloud Functions:</strong> Diseño de cooldown efectivo en cliente sin exposición a manipulación</li>
        <li><strong>main.dart monolítico:</strong> ~17,400 líneas dificultaron navegación y aumentaron tiempo de compilación</li>
      </ul>
    `
  },
  {
    id: 'ch9', num: '09', title: 'Instalación y Config.',
    content: `
      <h3>Instalación <span style="color:var(--accent-red)">&amp; Configuración</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 10</span><span>Guía de setup del entorno</span></div>
      <h4>Requisitos Previos</h4>
      <ul>
        <li><strong>Flutter SDK:</strong> 3.x (Dart ^3.11.4)</li>
        <li><strong>Android Studio:</strong> Hedgehog (2023.1.1) o superior</li>
        <li><strong>Xcode:</strong> 15.0+ (solo macOS para iOS)</li>
        <li><strong>Node.js:</strong> 20 LTS — Cloud Functions</li>
        <li><strong>Firebase CLI:</strong> 13.x — deploy de reglas y funciones</li>
      </ul>
      <h4>Comandos de Instalación</h4>
      <div class="code-block"><span class="comment"># 1. Clonar el repositorio</span>
git clone [repo-url] && cd social

<span class="comment"># 2. Instalar dependencias Flutter</span>
flutter pub get

<span class="comment"># 3. Configurar Firebase (Android)</span>
cp ~/Downloads/google-services.json android/app/

<span class="comment"># 4. Configurar Firebase (iOS)</span>
cp ~/Downloads/GoogleService-Info.plist ios/Runner/
cd ios && pod install && cd ..

<span class="comment"># 5. Variables de entorno</span>
cp .env.example .env
<span class="comment"># Editar .env con tu GOOGLE_VISION_API_KEY</span>

<span class="comment"># 6. Compilar APK de release</span>
flutter build apk --release --obfuscate \
  --split-debug-info=build/symbols</div>
      <h4>Variables de Entorno (.env)</h4>
      <div class="code-block"><span class="comment"># Google Cloud Vision API — Moderación de contenido</span>
<span class="keyword">GOOGLE_VISION_API_KEY</span>=<span class="string">tu_api_key_aqui</span></div>
      <p>⚠️ El archivo <code style="background:var(--bg-dark);padding:2px 6px;border-radius:3px;font-size:12px">.env</code> está en <code style="background:var(--bg-dark);padding:2px 6px;border-radius:3px;font-size:12px">.gitignore</code> y nunca debe subirse al repositorio. Comparte la API key solo mediante gestores de secretos o variables de CI/CD.</p>
    `
  },
  {
    id: 'ch10', num: '10', title: 'Ligas XP &amp; Roadmap',
    content: `
      <h3>Ligas XP <span style="color:var(--accent-red)">&amp; Roadmap</span></h3>
      <div class="chapter-meta"><span class="badge">Sección 14-15</span><span>Gamificación + futuro técnico</span></div>
      <h4>Niveles de Liga</h4>
      <div class="league-card"><div class="league-level">🟤</div><div class="league-info"><div class="league-name">Rookie</div><div class="league-xp">0 XP — Inicio</div></div></div>
      <div class="league-card"><div class="league-level">⚪</div><div class="league-info"><div class="league-name">Fan</div><div class="league-xp">100 XP mínimo</div></div></div>
      <div class="league-card"><div class="league-level">🟡</div><div class="league-info"><div class="league-name">Enthusiast</div><div class="league-xp">300 XP mínimo</div></div></div>
      <div class="league-card"><div class="league-level">🔵</div><div class="league-info"><div class="league-name">Paddock Pass</div><div class="league-xp">700 XP mínimo</div></div></div>
      <div class="league-card"><div class="league-level">🟣</div><div class="league-info"><div class="league-name">Pit Crew</div><div class="league-xp">1,500 XP mínimo</div></div></div>
      <div class="league-card"><div class="league-level">🔴</div><div class="league-info"><div class="league-name">Race Engineer</div><div class="league-xp">3,000 XP mínimo</div></div></div>
      <div class="league-card" style="border-color:rgba(255,215,0,0.3);background:rgba(255,215,0,0.05)"><div class="league-level">🏆</div><div class="league-info"><div class="league-name" style="color:var(--accent-gold)">Champion</div><div class="league-xp">6,000 XP — Nivel máximo</div></div></div>
      <h4>Roadmap Técnico — Prioridad Alta</h4>
      <ul>
        <li>Separar main.dart en módulos por feature (feed/, stats/, community/, profile/, admin/)</li>
        <li>Firestore Security Rules de producción con validación de tipos y rangos</li>
        <li>Migrar al plan Blaze y desplegar Cloud Functions: resetWeeklyXp, sendSessionReminders, deleteUserAccount completo, distributeXpForPredictions</li>
        <li>cached_network_image + paginación cursor-based del feed</li>
      </ul>
      <h4>Roadmap Técnico — Prioridad Media</h4>
      <ul>
        <li>Stories efímeras de 24 horas al estilo Instagram Stories</li>
        <li>Reacciones emoji en vídeos (🔥 😱 🏆 👏 💔)</li>
        <li>F1Social Premium con RevenueCat o Stripe</li>
        <li>Certificate Pinning para OpenF1 y Cloudinary</li>
      </ul>
    `
  }
];

/* ============================================================
   MANUAL INIT
   ============================================================ */
let currentChapter = 0;

function buildManual() {
  // TOC
  const toc = document.getElementById('manual-toc');
  chapters.forEach((ch, i) => {
    const item = document.createElement('div');
    item.className = 'toc-item' + (i === 0 ? ' active' : '');
    item.dataset.index = i;
    item.innerHTML = `<span class="toc-num">${ch.num}</span><span>${ch.title}</span>`;
    item.addEventListener('click', () => goToChapter(i));
    toc.appendChild(item);
  });
  // Chapters
  const container = document.getElementById('manual-chapters');
  chapters.forEach((ch, i) => {
    const div = document.createElement('div');
    div.className = 'chapter' + (i === 0 ? ' active' : '');
    div.id = ch.id;
    div.innerHTML = ch.content;
    container.appendChild(div);
  });
  updateProgress();
}

function goToChapter(index) {
  const allChapters = document.querySelectorAll('.chapter');
  const allToc = document.querySelectorAll('.toc-item');
  allChapters[currentChapter].classList.remove('active');
  allToc[currentChapter].classList.remove('active');
  currentChapter = index;
  allChapters[currentChapter].classList.add('active');
  allToc[currentChapter].classList.add('active');
  allToc[currentChapter].scrollIntoView({ block: 'nearest' });
  document.getElementById('manual-chapters').scrollTop = 0;
  updateProgress();
  analytics.track('manual_chapter_view', { chapter: chapters[index].title });
}

function changeChapter(dir) {
  const next = currentChapter + dir;
  if (next >= 0 && next < chapters.length) goToChapter(next);
}

function updateProgress() {
  const total = chapters.length;
  const pct = ((currentChapter + 1) / total * 100).toFixed(0);
  document.getElementById('chapter-indicator').textContent = `${currentChapter + 1} / ${total}`;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('prev-btn').disabled = currentChapter === 0;
  document.getElementById('next-btn').disabled = currentChapter === total - 1;
}

/* ============================================================
   MANUAL SEARCH
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildManual();

  document.getElementById('manual-search').addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    const tocItems = document.querySelectorAll('.toc-item');
    if (!q) {
      tocItems.forEach(item => item.style.display = '');
      return;
    }
    chapters.forEach((ch, i) => {
      const match = ch.title.toLowerCase().includes(q) || ch.content.toLowerCase().includes(q);
      tocItems[i].style.display = match ? '' : 'none';
      if (match) analytics.track('manual_search', { query: q, found: ch.title });
    });
  });
});

/* ============================================================
   ARCHITECTURE DIAGRAM SVG
   ============================================================ */
function buildDiagram() {
  const canvas = document.getElementById('diagram-canvas');
  canvas.innerHTML = `
<svg viewBox="0 0 860 500" xmlns="http://www.w3.org/2000/svg" class="arch-svg" style="width:860px;height:500px">
  <defs>
    <linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8002D" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#9B001E" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0090FF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#005BB5" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFD700" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#C9A800" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22C55E" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#15803D" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A855F7" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#7E22CE" stop-opacity="0.85"/>
    </linearGradient>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#5C5C6E"/>
    </marker>
  </defs>

  <!-- Background grid -->
  <rect width="860" height="500" fill="#0A0A0F" rx="8"/>
  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1C1C26" stroke-width="0.5"/>
  </pattern>
  <rect width="860" height="500" fill="url(#grid)" rx="8" opacity="0.5"/>

  <!-- FLUTTER CLIENT (center top) -->
  <g class="arch-node" onclick="alert('Cliente Flutter\n\n• main.dart (~17,400 líneas)\n• Screens: Feed, Live, Community, Stats, Profile, Admin\n• Patrón: FutureBuilder + StreamBuilder\n• Compilación AOT a ARM/x64')">
    <rect x="250" y="30" width="360" height="110" rx="10" fill="#13131A" stroke="#2A2A3A" stroke-width="1.5"/>
    <rect x="250" y="30" width="360" height="32" rx="10" fill="url(#gRed)"/>
    <rect x="250" y="50" width="360" height="12" fill="url(#gRed)"/>
    <text x="430" y="52" font-family="'Barlow Condensed',sans-serif" font-size="13" font-weight="700" fill="white" text-anchor="middle" letter-spacing="2">🐦  CLIENTE FLUTTER</text>
    <text x="290" y="82" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">📱 Feed</text>
    <text x="340" y="82" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">🔴 Live</text>
    <text x="385" y="82" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">🏎️ Community</text>
    <text x="455" y="82" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">📊 Stats</text>
    <text x="500" y="82" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">👤 Profile</text>
    <text x="290" y="102" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">🛡️ Admin</text>
    <text x="340" y="102" font-family="'Outfit',sans-serif" font-size="10" fill="#5C5C6E">Dart 3.11.4 · Flutter 3.x · compileSdk 36</text>
    <text x="430" y="128" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E" text-anchor="middle">Toca un nodo para más información</text>
  </g>

  <!-- Left arrow Firebase SDK -->
  <line x1="310" y1="140" x2="240" y2="195" stroke="#5C5C6E" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrow)"/>
  <text x="240" y="175" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">Firebase SDK</text>
  <text x="240" y="186" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">(WebSocket/gRPC)</text>

  <!-- Right arrow OpenF1 -->
  <line x1="550" y1="140" x2="620" y2="195" stroke="#5C5C6E" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrow)"/>
  <text x="565" y="175" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">HTTP REST</text>

  <!-- FIREBASE BACKEND (left) -->
  <g class="arch-node" onclick="alert('Firebase Backend\n\n• Firebase Auth: Email, Google, Apple\n• Firestore: NoSQL RT, 8 colecciones\n• FCM: Push notifications + topics\n• Storage: Imágenes de perfil\n• Cloud Functions: pendiente plan Blaze')">
    <rect x="60" y="195" width="260" height="200" rx="10" fill="#13131A" stroke="#2A2A3A" stroke-width="1.5"/>
    <rect x="60" y="195" width="260" height="30" rx="10" fill="url(#gGold)"/>
    <rect x="60" y="213" width="260" height="12" fill="url(#gGold)"/>
    <text x="190" y="214" font-family="'Barlow Condensed',sans-serif" font-size="12" font-weight="700" fill="#0A0A0F" text-anchor="middle" letter-spacing="2">🔥  FIREBASE</text>
    <!-- Sub-services -->
    <rect x="78" y="238" width="220" height="30" rx="5" fill="#1C1C26" stroke="#2A2A3A" stroke-width="1"/>
    <text x="98" y="258" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">🔐 Firebase Auth</text>
    <text x="210" y="258" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">Email · Google · Apple</text>
    <rect x="78" y="276" width="220" height="30" rx="5" fill="#1C1C26" stroke="#2A2A3A" stroke-width="1"/>
    <text x="98" y="296" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">🗄️ Cloud Firestore</text>
    <text x="225" y="296" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">NoSQL RT</text>
    <rect x="78" y="314" width="220" height="30" rx="5" fill="#1C1C26" stroke="#2A2A3A" stroke-width="1"/>
    <text x="98" y="334" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E">🔔 FCM Messaging</text>
    <text x="225" y="334" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">Topics</text>
    <rect x="78" y="352" width="100" height="26" rx="5" fill="#1C1C26" stroke="#2A2A3A" stroke-width="1"/>
    <text x="128" y="369" font-family="'Outfit',sans-serif" font-size="10" fill="#9E9E9E" text-anchor="middle">📁 Storage</text>
    <rect x="186" y="352" width="112" height="26" rx="5" fill="#1C1C26" stroke="#2A2A3A" stroke-width="1"/>
    <text x="242" y="369" font-family="'Outfit',sans-serif" font-size="10" fill="#5C5C6E" text-anchor="middle">⚙️ Functions*</text>
  </g>

  <!-- OPENF1 (right) -->
  <g class="arch-node" onclick="alert('OpenF1 API\n\nAPI pública y gratuita\nURL: api.openf1.org/v1/\n\nEndpoints:\n• /position — Posiciones en pista\n• /car_data — Telemetría (vel, RPM, DRS)\n• /team_radio — Clips de audio\n• /weather — Condiciones climáticas\n• /race_control — Banderas, safety car\n• /intervals — Gaps entre pilotos\n• /laps — Tiempos de vuelta\n\nPolling: 2s (posiciones), 5s (telemetría)')">
    <rect x="540" y="195" width="220" height="130" rx="10" fill="#13131A" stroke="#2A2A3A" stroke-width="1.5"/>
    <rect x="540" y="195" width="220" height="30" rx="10" fill="url(#gBlue)"/>
    <rect x="540" y="213" width="220" height="12" fill="url(#gBlue)"/>
    <text x="650" y="214" font-family="'Barlow Condensed',sans-serif" font-size="12" font-weight="700" fill="white" text-anchor="middle" letter-spacing="2">🏎️  OPENF1 API</text>
    <text x="558" y="244" font-family="'Outfit',sans-serif" font-size="9" fill="#9E9E9E">api.openf1.org/v1/</text>
    <text x="558" y="260" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">📍 /position · 🚗 /car_data</text>
    <text x="558" y="276" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">📻 /team_radio · 🌤️ /weather</text>
    <text x="558" y="292" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">🚦 /race_control · ⏱️ /laps</text>
    <text x="558" y="308" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">📡 /intervals · 📍 /location</text>
  </g>

  <!-- CLOUDINARY (right lower) -->
  <g class="arch-node" onclick="alert('Cloudinary CDN\n\n• Upload directo desde cliente (unsigned preset)\n• CDN global — nodo más cercano al usuario\n• Thumbnails automáticos del primer fotograma\n• Optimización adaptativa: H.264, VP9, AV1\n• SDK: cloudinary_public ^0.23.1')">
    <rect x="540" y="350" width="220" height="80" rx="10" fill="#13131A" stroke="#2A2A3A" stroke-width="1.5"/>
    <rect x="540" y="350" width="220" height="28" rx="10" fill="url(#gGreen)"/>
    <rect x="540" y="367" width="220" height="11" fill="url(#gGreen)"/>
    <text x="650" y="368" font-family="'Barlow Condensed',sans-serif" font-size="12" font-weight="700" fill="white" text-anchor="middle" letter-spacing="2">☁️  CLOUDINARY CDN</text>
    <text x="558" y="396" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">🎥 Videos · 🖼️ Thumbnails automáticos</text>
    <text x="558" y="412" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">CDN Global · H.264 / VP9 / AV1</text>
  </g>

  <!-- GOOGLE VISION (far right) -->
  <g class="arch-node" onclick="alert('Google Cloud Vision API\n\nModeración automática de contenido\n\nSafeSearch Categories:\n• adult — Contenido explícito\n• violence — Violencia/gore\n• racy — Sugerente\n• medical — Imágenes médicas\n• spoof — Contenido manipulado\n\nUmbral de rechazo: LIKELY o superior\n\nAPI Key almacenada en .env (AES-256)\nSin exponer en repositorio')">
    <rect x="700" y="460" width="145" height="30" rx="8" fill="#13131A" stroke="#2A2A3A" stroke-width="1.5"/>
    <text x="773" y="479" font-family="'Outfit',sans-serif" font-size="9" fill="#9E9E9E" text-anchor="middle">👁️ Google Vision API</text>
  </g>

  <!-- Arrow Cloudinary → Vision -->
  <line x1="650" y1="430" x2="730" y2="460" stroke="#5C5C6E" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
  <text x="665" y="452" font-family="'Outfit',sans-serif" font-size="9" fill="#5C5C6E">SafeSearch</text>

  <!-- Arrow Flutter → Cloudinary -->
  <line x1="590" y1="330" x2="620" y2="350" stroke="#5C5C6E" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arrow)"/>

  <!-- Legend -->
  <rect x="60" y="450" width="280" height="38" rx="6" fill="#13131A" stroke="#2A2A3A" stroke-width="1"/>
  <circle cx="80" cy="469" r="4" fill="url(#gRed)"/>
  <text x="88" y="473" font-family="'Outfit',sans-serif" font-size="9" fill="#9E9E9E">Flutter Client</text>
  <circle cx="145" cy="469" r="4" fill="url(#gGold)"/>
  <text x="153" y="473" font-family="'Outfit',sans-serif" font-size="9" fill="#9E9E9E">Firebase</text>
  <circle cx="205" cy="469" r="4" fill="url(#gBlue)"/>
  <text x="213" y="473" font-family="'Outfit',sans-serif" font-size="9" fill="#9E9E9E">OpenF1</text>
  <circle cx="255" cy="469" r="4" fill="url(#gGreen)"/>
  <text x="263" y="473" font-family="'Outfit',sans-serif" font-size="9" fill="#9E9E9E">CDN</text>
  <text x="80" y="485" font-family="'Outfit',sans-serif" font-size="8" fill="#5C5C6E">* Toca cada nodo para detalles</text>
</svg>`;
}

/* ============================================================
   ZOOM
   ============================================================ */
let currentZoom = 1;

function changeZoom(delta) {
  currentZoom = Math.min(2, Math.max(0.4, currentZoom + delta));
  document.getElementById('diagram-canvas').style.transform = `scale(${currentZoom})`;
  document.getElementById('zoom-label').textContent = Math.round(currentZoom * 100) + '%';
  analytics.track('diagram_zoom', { level: currentZoom });
}

function resetZoom() {
  currentZoom = 1;
  document.getElementById('diagram-canvas').style.transform = 'scale(1)';
  document.getElementById('zoom-label').textContent = '100%';
}

function openLightbox() {
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lightbox-content');
  content.innerHTML = document.getElementById('diagram-canvas').innerHTML;
  content.querySelector('svg').style.width = '100%';
  content.querySelector('svg').style.height = 'auto';
  lb.classList.add('open');
  analytics.track('diagram_fullscreen');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function closeLightboxOutside(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ============================================================
   DRAG TO PAN
   ============================================================ */
const viewport = document.getElementById('diagram-viewport');
let isDragging = false, startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;

if (viewport) {
  viewport.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
  });
  viewport.addEventListener('mouseleave', () => isDragging = false);
  viewport.addEventListener('mouseup', () => isDragging = false);
  viewport.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;
    viewport.scrollLeft = scrollLeft - (x - startX);
    viewport.scrollTop = scrollTop - (y - startY);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildDiagram();
});

// Also init diagram if already loaded
if (document.readyState !== 'loading') {
  buildDiagram();
}
