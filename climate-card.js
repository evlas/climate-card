/**
 * Climate Card - Custom Lovelace Card for Home Assistant
 * Refactored to match the original Home Assistant Thermostat Card
 * (hui-thermostat-card, ha-state-control-climate-temperature, ha-control-circular-slider, ha-big-number)
 * 
 * Features:
 * - 1:1 original Home Assistant Thermostat Card shapes, proportions, geometry, and colors
 * - Official 320x320 viewBox, 145 radius, 28px stroke width, 270° sweep angle (135° to 405°)
 * - State colors: Heating (#ff9e6b / --state-climate-heat-color), Cooling (#71bcf9 / --state-climate-cool-color), Off, Auto
 * - Soft radial gradient glow background behind the dial (opacity 0.15)
 * - Accurate target knob & current temperature dot with smooth, non-destructive pointer dragging
 * - Official Big Number display (58px integer, stacked °C unit and decimal)
 * - Secondary temperature display and clickable integrated humidity (💧)
 * - 48px circular outlined stepper buttons (− / +) and integrated header Reset button
 * - Cleanly integrated fixtures (balconies, windows) with open alert pulse (#ef4444)
 * - Cleanly integrated zone valve (sensor, number, valve entity with percentage/state)
 * - Cleanly integrated towel heater / radiator (switch, climate, input_boolean)
 * - Segmented feature bar & dropdown support for presets and HVAC modes matching hui-card-features
 * - Universal events (+ / - / Reset) for scripts, buttons, and switches, plus native HA climate services
 * - Automatic IT / EN localization based on Home Assistant language
 * - Visual UI Editor support (ha-form schema)
 */

const CARD_VERSION = "2.2.0";

console.info(
  `%c CLIMATE-CARD %c v${CARD_VERSION} `,
  "color: white; background: #0284c7; font-weight: bold; border-radius: 4px 0 0 4px;",
  "color: #0284c7; background: #e0f2fe; font-weight: bold; border-radius: 0 4px 4px 0;"
);

// Translations (IT & EN)
const TRANSLATIONS = {
  it: {
    default_name: "Termostato",
    unavailable: "Non disponibile",
    idle: "Inattivo",
    off: "Spento",
    heating: "Riscaldamento",
    cooling: "Raffreddamento",
    auto: "Automatico",
    heat_cool: "Caldo/Freddo Auto",
    dry: "Deumidificazione",
    fan_only: "Solo ventilatore",
    reset_tooltip: "Reset Setpoint / Aggiorna",
    more_info_tooltip: "Dettagli",
    target_temp_tooltip: "Temperatura impostata (Setpoint)",
    current_temp_tooltip: "Temperatura attuale",
    humidity_tooltip: "Umidità di zona",
    balcony_default: "Balcone",
    window_default: "Finestra",
    open_m: "Aperto",
    closed_m: "Chiuso",
    open_f: "Aperta",
    closed_f: "Chiusa",
    towel_heater_default: "Termoarredo",
    towel_heater_tooltip: "Clicca per accendere/spegnere",
    valve_tooltip: "Valvola di zona",
    step_down_tooltip: "Riduci temperatura",
    step_up_tooltip: "Aumenta temperatura",
    presets: {
      comfort: "Comfort",
      standby: "Standby",
      economy: "Economy",
      eco: "Eco",
      building_protection: "Protezione Edificio",
      frost_protection: "Protezione Antigelo",
      away: "Fuori casa",
      boost: "Boost",
      sleep: "Notte",
      home: "A casa",
      activity: "Attività",
      none: "Nessuno"
    },
    hvac: {
      heat: "Riscaldamento",
      cool: "Raffreddamento",
      auto: "Automatico",
      heat_cool: "Caldo/Freddo Auto",
      dry: "Deumidificazione",
      fan_only: "Solo Ventilatore",
      off: "Spento"
    },
    editor: {
      entity: "Entità Termostato (Climate) *",
      name: "Titolo Card (Opzionale)",
      valve_entity: "Entità Valvola di Zona (Opzionale)",
      towel_heater: "Termoarredo Bagno (Switch/Clima Opzionale)",
      windows: "Finestre (Binary Sensor)",
      balconies: "Balconi / Portefinestre (Binary Sensor)",
      humidity_entity: "Sensore Umidità (Opzionale)",
      show_current_as_primary: "Temperatura Attuale grande al centro (e Setpoint sotto)",
      disable_slider: "Disabilita trascinamento ghiera (solo tasti + e −)",
      event_up: "Azione Aumento Setpoint (+) [Script / Button / Switch]",
      event_down: "Azione Diminuzione Setpoint (−) [Script / Button / Switch]",
      event_reset: "Azione Reset Setpoint (↻) [Script / Button / Switch]"
    }
  },
  en: {
    default_name: "Thermostat",
    unavailable: "Unavailable",
    idle: "Idle",
    off: "Off",
    heating: "Heating",
    cooling: "Cooling",
    auto: "Auto",
    heat_cool: "Heat/Cool",
    dry: "Drying",
    fan_only: "Fan only",
    reset_tooltip: "Reset Setpoint / Refresh",
    more_info_tooltip: "More info",
    target_temp_tooltip: "Target temperature (Setpoint)",
    current_temp_tooltip: "Current temperature",
    humidity_tooltip: "Zone humidity",
    balcony_default: "Balcony",
    window_default: "Window",
    open_m: "Open",
    closed_m: "Closed",
    open_f: "Open",
    closed_f: "Closed",
    towel_heater_default: "Towel Heater",
    towel_heater_tooltip: "Click to toggle",
    valve_tooltip: "Zone valve",
    step_down_tooltip: "Decrease temperature",
    step_up_tooltip: "Increase temperature",
    presets: {
      comfort: "Comfort",
      standby: "Standby",
      economy: "Economy",
      eco: "Eco",
      building_protection: "Building Protection",
      frost_protection: "Frost Protection",
      away: "Away",
      boost: "Boost",
      sleep: "Sleep",
      home: "Home",
      activity: "Activity",
      none: "None"
    },
    hvac: {
      heat: "Heat",
      cool: "Cool",
      auto: "Auto",
      heat_cool: "Heat/Cool",
      dry: "Dry",
      fan_only: "Fan only",
      off: "Off"
    },
    editor: {
      entity: "Thermostat Entity (Climate) *",
      name: "Card Title (Optional)",
      valve_entity: "Zone Valve Entity (Optional)",
      towel_heater: "Bathroom Towel Heater (Switch/Climate Optional)",
      windows: "Windows (Binary Sensor)",
      balconies: "Balconies / Patio Doors (Binary Sensor)",
      humidity_entity: "Humidity Sensor (Optional)",
      show_current_as_primary: "Show Current Temperature as primary large number",
      disable_slider: "Disable circular slider dragging (buttons + and − only)",
      event_up: "Setpoint Up Action (+) [Script / Button / Switch]",
      event_down: "Setpoint Down Action (−) [Script / Button / Switch]",
      event_reset: "Setpoint Reset Action (↻) [Script / Button / Switch]"
    }
  }
};

// Standard MDI SVGs used throughout Home Assistant
const ICONS = {
  minus: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M19 13H5v-2h14v2z"/>
  </svg>`,
  plus: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>`,
  dots_vertical: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>`,
  refresh: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>`,
  water_percent: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>`,
  thermometer: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z"/>
  </svg>`,
  target: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>`,
  valve: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z"/>
  </svg>`,
  heating_coil: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z"/>
  </svg>`,
  balcony_closed: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 21V9a8 8 0 0 1 16 0v12"></path>
    <line x1="12" y1="2" x2="12" y2="21"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="4" y1="21" x2="20" y2="21"></line>
  </svg>`,
  balcony_open: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 21V9a8 8 0 0 1 16 0v12"></path>
    <path d="M4 9l8 3v9L4 18V9z" fill="currentColor" fill-opacity="0.2"></path>
    <line x1="4" y1="21" x2="20" y2="21"></line>
  </svg>`,
  window_closed: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2"></rect>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="12" y1="3" x2="12" y2="21"></line>
  </svg>`,
  window_open: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2"></rect>
    <path d="M4 12l8-2v11l-8-2v-7z" fill="currentColor" fill-opacity="0.25"></path>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="12" y1="3" x2="12" y2="21"></line>
  </svg>`,
  // Presets & Modes
  sofa: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3a3 3 0 0 0-2 3v5a1 1 0 0 0 1 1h1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1v-5a3 3 0 0 0-2-3zm-14-3h12v3h-12V7zm14 8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2z"/>
  </svg>`,
  away: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2h-2V5H7v14h10v-4h2m1.59-3.41L18 7l-1.41 1.41L18.17 10H11v2h7.17l-1.58 1.59L18 15l4-4-1.41-1.41z"/>
  </svg>`,
  eco: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </svg>`,
  boost: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5C4.7 13.9 3.96 15.35 3.39 16.91L9.5 14.15C8.58 12.78 7.8 11.33 7.21 9.77L5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C9.5 14 12 16.5 13.36 19.35C15.47 18.5 17.88 17.19 20.07 15C25.73 9.34 23.61 4.39 23.61 4.39L21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 17.77 9.24 17.16 9 16.53L5.79 18L6.24 22M2 17.76L5.64 21.4L6.09 17.76L4.24 15.91L2 17.76Z"/>
  </svg>`,
  standby: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-13h-2v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>`,
  shield_home: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6l6 5h-3v4H9v-4H6l6-5z"/>
  </svg>`,
  building_protection: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6l6 5h-3v4H9v-4H6l6-5z"/>
  </svg>`,
  sleep: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 7h-8v8H3V5H1v15h2v-3h18v3h2v-9a4 4 0 0 0-4-4m1 8h-8V9h7a2 2 0 0 1 2 2v4M7 13A3 3 0 0 0 10 10A3 3 0 0 0 7 7A3 3 0 0 0 4 10A3 3 0 0 0 7 13Z"/>
  </svg>`,
  circle: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <circle cx="12" cy="12" r="5"/>
  </svg>`,
  power: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16.56 5.44l-1.45 1.45A7 7 0 1 1 8.89 6.89L7.44 5.44A9 9 0 1 0 16.56 5.44zM13 2h-2v10h2V2z"/>
  </svg>`,
  fire: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M13.5 2c0 2.5-2 3.5-3 5.5-1.5 3-1 5.5.5 7.5.5.7.5 1.5 0 2.2-.5.7-1.3 1.1-2 1.1-1.5 0-2.8-1.1-3-2.6-.5-3.3 1.2-6.2 2-7.7C6.5 7.5 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-3-8.5-6.5-10z"/>
  </svg>`,
  snowflake: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M22 11h-4.17l2.58-2.59L19 7l-5 5 5 5 1.41-1.41L17.83 13H22v-2zM2 13h4.17l-2.58 2.59L5 17l5-5-5-5-1.41 1.41L6.17 11H2v2zm11-11v4.17l2.59-2.58L17 5l-5 5-5-5 1.41-1.41L11 6.17V2h2zm0 20v-4.17l-2.59 2.58L9 19l5-5 5 5-1.41 1.41L13 17.83V22h-2z"/>
  </svg>`,
  autorenew: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
  </svg>`,
  fan: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 11a1 1 0 1 0 1 1 1 1 0 0 0-1-1zm0-9a4 4 0 0 0-4 4 4 4 0 0 0 .14 1A4 4 0 0 0 5 10a4 4 0 0 0 4 4 4 4 0 0 0 1-.14A4 4 0 0 0 14 17a4 4 0 0 0 4-4 4 4 0 0 0-.14-1A4 4 0 0 0 21 9a4 4 0 0 0-4-4 4 4 0 0 0-1 .14A4 4 0 0 0 12 2z"/>
  </svg>`
};

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getLang(hass, configLang) {
  const raw = String(configLang || hass?.locale?.language || hass?.language || navigator.language || "it").toLowerCase();
  return raw.startsWith("it") ? "it" : "en";
}

/**
 * Calculates SVG arc path using exact Home Assistant geometry
 * (320x320 viewBox, center 160,160, radius 145)
 */
function describeArc(cx, cy, r, startAngle, endAngle) {
  if (endAngle <= startAngle) return "";
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const sX = cx + r * Math.cos(startRad);
  const sY = cy + r * Math.sin(startRad);
  const eX = cx + r * Math.cos(endRad);
  const eY = cy + r * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${sX.toFixed(2)} ${sY.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${eX.toFixed(2)} ${eY.toFixed(2)}`;
}

function polarToXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

class ClimateCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isDragging = false;
    this._tempPending = null;
    this._pendingTimer = null;
    this._resetSpinning = false;
    this._resetTimer = null;
    this._lastStateSignature = null;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    // Never destroy the DOM while the user is actively dragging the circular slider
    if (this._isDragging) return;

    const sig = this._computeStateSignature(hass);
    if (sig !== this._lastStateSignature) {
      this._lastStateSignature = sig;
      this._updateCard();
    }
  }

  _computeStateSignature(hass) {
    if (!hass || !this._config) return "";
    const entities = [
      this._config.entity,
      this._config.valve_entity,
      this._config.towel_heater,
      this._config.humidity_entity,
      ...this._normalizeEntities(this._config.windows),
      ...this._normalizeEntities(this._config.balconies)
    ].filter(Boolean);

    const lang = getLang(hass, this._config.language);
    const parts = [lang, this._tempPending, this._resetSpinning];

    for (const id of entities) {
      const st = hass.states[id];
      if (!st) {
        parts.push(`${id}:null`);
      } else {
        const a = st.attributes || {};
        parts.push(
          `${id}:${st.state}:${a.temperature}:${a.current_temperature}:${a.current_humidity}:${a.hvac_action}:${a.preset_mode}:${a.current_position}:${a.friendly_name}`
        );
      }
    }
    return parts.join("|");
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("Specificare l'entità climate (es: entity: climate.salotto)");
    }

    // Parse features: [] matching Home Assistant official features
    let presetModes = null;
    let presetStyle = config.preset_style || "icons";
    let hvacModes = null;
    let hvacStyle = config.hvac_style || "icons";

    let valveEntity = config.valve_entity || "";
    let towelHeater = config.towel_heater || config.heater_entity || config.termoarredo || "";
    let windows = config.windows || config.window_entity;
    let balconies = config.balconies || config.balcony_entity;
    let humidityEntity = config.humidity_entity || "";

    if (Array.isArray(config.features)) {
      config.features.forEach(f => {
        if (!f || !f.type) return;
        if (f.type === "climate-preset-modes" || f.type === "climate-presets") {
          if (Array.isArray(f.preset_modes)) presetModes = [...f.preset_modes];
          if (f.style) presetStyle = f.style;
        } else if (f.type === "climate-hvac-modes" || f.type === "hvac-modes") {
          if (Array.isArray(f.hvac_modes)) hvacModes = [...f.hvac_modes];
          else hvacModes = "auto_from_entity";
          if (f.style) hvacStyle = f.style;
        } else if (f.type === "climate-card-valve" || f.type === "valve") {
          if (f.entity && !valveEntity) valveEntity = f.entity;
        } else if (f.type === "climate-card-towel-heater" || f.type === "towel-heater") {
          if (f.entity && !towelHeater) towelHeater = f.entity;
        } else if (f.type === "climate-card-fixtures" || f.type === "fixtures") {
          if (f.windows && (!windows || (Array.isArray(windows) && !windows.length))) windows = f.windows;
          if (f.balconies && (!balconies || (Array.isArray(balconies) && !balconies.length))) balconies = f.balconies;
        } else if (f.type === "humidity" || f.type === "humidity-sensor") {
          if (f.entity && !humidityEntity) humidityEntity = f.entity;
        }
      });
    }

    if (!presetModes && (config.preset_modes || config.presets)) {
      presetModes = Array.isArray(config.preset_modes)
        ? [...config.preset_modes]
        : (Array.isArray(config.presets) ? [...config.presets] : null);
    }

    if (!hvacModes && Array.isArray(config.hvac_modes)) {
      hvacModes = [...config.hvac_modes];
    }

    const eventUp = config.event_up || config.script_up || config.action_up || "";
    const eventDown = config.event_down || config.script_down || config.action_down || "";
    const eventReset = config.event_reset || config.script_reset || config.reset_script || config.action_reset || config.reset_entity || "";

    this._config = {
      ...config,
      name: config.name,
      entity: config.entity,
      theme: config.theme,
      features: config.features,
      preset_modes: presetModes,
      preset_style: presetStyle,
      hvac_modes: hvacModes,
      hvac_style: hvacStyle,
      preset_icons: config.preset_icons || {},
      valve_entity: valveEntity || undefined,
      towel_heater: towelHeater || undefined,
      windows: windows,
      balconies: balconies,
      humidity_entity: humidityEntity || undefined,
      step: config.step,
      min_temp: config.min_temp,
      max_temp: config.max_temp,
      show_current_as_primary: config.show_current_as_primary !== false, // Default: true (Temperatura Attuale grande)
      event_up: eventUp || undefined,
      event_down: eventDown || undefined,
      event_reset: eventReset || undefined,
      disable_slider: config.disable_slider
    };

    this._lastStateSignature = null;
    this._updateCard();
  }

  static async getConfigElement() {
    return document.createElement("climate-card-editor");
  }

  static getStubConfig(hass, entities) {
    const climateEntity = entities.find(e => e.startsWith("climate.")) || "climate.salotto";
    return {
      entity: climateEntity,
      name: "",
      valve_entity: "",
      windows: [],
      balconies: [],
      humidity_entity: "",
      features: [
        {
          type: "climate-preset-modes",
          style: "icons",
          preset_modes: ["comfort", "standby", "economy", "building_protection"]
        }
      ]
    };
  }

  getCardSize() {
    return 6;
  }

  _t() {
    const lang = getLang(this._hass, this._config?.language);
    return TRANSLATIONS[lang] || TRANSLATIONS.it;
  }

  _normalizeKey(key) {
    if (!key) return "";
    return String(key).toLowerCase().trim().replace(/[-\s]+/g, "_");
  }

  _getPresetList(stateObj) {
    // 1. Explicitly configured preset_modes (from features or root config)
    if (Array.isArray(this._config.preset_modes) && this._config.preset_modes.length > 0) {
      return this._config.preset_modes;
    }
    // 2. From entity attributes
    if (Array.isArray(stateObj?.attributes?.preset_modes) && stateObj.attributes.preset_modes.length > 0) {
      return stateObj.attributes.preset_modes;
    }
    // 3. Fallback default
    return ["comfort", "standby", "economy", "building_protection"];
  }

  _getHvacList(stateObj) {
    if (Array.isArray(this._config.hvac_modes) && this._config.hvac_modes.length > 0) {
      return this._config.hvac_modes;
    }
    if (this._config.hvac_modes === "auto_from_entity") {
      return stateObj?.attributes?.hvac_modes || ["heat", "cool", "off"];
    }
    return null;
  }

  _getPresetIcon(preset) {
    const norm = this._normalizeKey(preset);

    if (this._config.preset_icons && this._config.preset_icons[preset]) {
      const custom = this._config.preset_icons[preset];
      if (typeof custom === "string" && custom.startsWith("<svg")) return custom;
      return `<ha-icon icon="${escapeHtml(custom)}"></ha-icon>`;
    }

    if (norm === "comfort" || norm === "home") return ICONS.sofa;
    if (norm === "standby") return ICONS.standby;
    if (norm === "economy" || norm === "eco") return ICONS.eco;
    if (norm === "building_protection" || norm === "building" || norm === "protection" || norm === "protezione_edificio") return ICONS.shield_home;
    if (norm === "frost_protection" || norm === "frost" || norm === "antigelo") return ICONS.snowflake;
    if (norm === "away" || norm === "vacation" || norm === "fuori_casa") return ICONS.away;
    if (norm === "boost" || norm === "activity") return ICONS.boost;
    if (norm === "sleep" || norm === "night" || norm === "notte") return ICONS.sleep;
    if (norm === "none" || norm === "off") return ICONS.power;

    return ICONS.circle;
  }

  _getPresetLabel(preset) {
    const norm = this._normalizeKey(preset);
    const t = this._t();
    return t.presets[norm] || String(preset).replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }

  _getHvacIcon(mode) {
    const norm = this._normalizeKey(mode);
    if (norm === "heat") return ICONS.fire;
    if (norm === "cool") return ICONS.snowflake;
    if (norm === "auto" || norm === "heat_cool") return ICONS.autorenew;
    if (norm === "dry") return ICONS.water_percent;
    if (norm === "fan_only" || norm === "fan") return ICONS.fan;
    if (norm === "off") return ICONS.power;
    return ICONS.circle;
  }

  _getHvacLabel(mode) {
    const norm = this._normalizeKey(mode);
    const t = this._t();
    return t.hvac[norm] || String(mode).replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }

  _normalizeEntities(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    return [val];
  }

  _getEntitiesList(entityIds) {
    const list = this._normalizeEntities(entityIds);
    if (!list.length || !this._hass) return [];

    return list.map(id => {
      const stateObj = this._hass.states[id];
      const isOpen = stateObj && (stateObj.state === "on" || stateObj.state === "open");
      const name = stateObj?.attributes?.friendly_name || id;
      return { entity_id: id, isOpen, name };
    });
  }

  _getValveState() {
    if (!this._config.valve_entity || !this._hass) return null;
    const stateObj = this._hass.states[this._config.valve_entity];
    if (!stateObj) return null;

    let display = stateObj.state;
    let numVal = parseFloat(display);

    if (stateObj.attributes && stateObj.attributes.current_position !== undefined) {
      numVal = Number(stateObj.attributes.current_position);
      display = `${Math.round(numVal)}%`;
    } else if (!isNaN(numVal)) {
      display = `${Math.round(numVal)}%`;
    } else if (stateObj.attributes && stateObj.attributes.unit_of_measurement === "%") {
      display = `${stateObj.state}%`;
    }

    return {
      entity_id: this._config.valve_entity,
      display: display,
      isOpen: (!isNaN(numVal) && numVal > 0) || stateObj.state === "open" || stateObj.state === "on"
    };
  }

  _getTowelHeaterState() {
    const entityId = this._config.towel_heater;
    if (!entityId || !this._hass) return null;
    const stateObj = this._hass.states[entityId];
    if (!stateObj) return null;

    const t = this._t();
    const domain = entityId.split(".")[0];
    const st = stateObj.state;
    const isOn = domain === "climate"
      ? (st !== "off" && st !== "unavailable" && st !== "unknown")
      : (st === "on" || st === "open");

    const name = stateObj.attributes?.friendly_name || t.towel_heater_default;
    const display = isOn ? "ON" : "OFF";

    return {
      entity_id: entityId,
      state: st,
      isOn: isOn,
      display: display,
      name: name
    };
  }

  _toggleTowelHeater(entityId) {
    if (!this._hass || !entityId) return;
    const domain = entityId.split(".")[0];
    const stateObj = this._hass.states[entityId];
    if (domain === "climate" && stateObj) {
      const isOff = stateObj.state === "off";
      this._hass.callService("climate", isOff ? "turn_on" : "turn_off", {
        entity_id: entityId
      });
      return;
    }
    this._hass.callService("homeassistant", "toggle", {
      entity_id: entityId
    });
  }

  _getHumidityState(climateState) {
    if (this._config.humidity_entity && this._hass) {
      const humObj = this._hass.states[this._config.humidity_entity];
      if (humObj && !isNaN(parseFloat(humObj.state))) {
        return {
          value: Math.round(parseFloat(humObj.state)),
          entity_id: this._config.humidity_entity
        };
      }
    }
    if (climateState?.attributes?.current_humidity !== undefined && !isNaN(parseFloat(climateState.attributes.current_humidity))) {
      return {
        value: Math.round(parseFloat(climateState.attributes.current_humidity)),
        entity_id: this._config.entity
      };
    }
    return null;
  }

  /**
   * Colors and State info identical to Home Assistant frontend stateColorCss & theme variables
   */
  _getClimateModeInfo(stateObj) {
    const t = this._t();
    if (!stateObj || stateObj.state === "unavailable" || stateObj.state === "unknown") {
      return {
        hvacMode: "off",
        isAvailable: false,
        isHeating: false,
        isCooling: false,
        isOff: true,
        actionColor: "var(--state-climate-off-color, var(--disabled-color, #9e9e9e))",
        stateText: t.unavailable
      };
    }

    const hvacMode = stateObj.state || "off";
    const hvacAction = stateObj.attributes?.hvac_action;

    const isHeating = hvacAction === "heating" || (hvacMode === "heat" && hvacAction !== "idle");
    const isCooling = hvacAction === "cooling" || (hvacMode === "cool" && hvacAction !== "idle");
    const isOff = hvacMode === "off";

    // Standard Home Assistant state texts
    let stateText = t.idle;
    if (isOff) {
      stateText = t.off;
    } else if (hvacAction === "heating") {
      stateText = t.heating;
    } else if (hvacAction === "cooling") {
      stateText = t.cooling;
    } else if (hvacMode === "heat") {
      stateText = t.heating;
    } else if (hvacMode === "cool") {
      stateText = t.cooling;
    } else if (hvacMode === "auto") {
      stateText = t.auto;
    } else if (hvacMode === "heat_cool") {
      stateText = t.heat_cool;
    } else if (hvacMode === "dry") {
      stateText = t.dry;
    } else if (hvacMode === "fan_only") {
      stateText = t.fan_only;
    }

    // Official Home Assistant state color CSS variables with calibrated fallbacks
    // Heat: #ff9e6b / Cool: #71bcf9 / Off: #9e9e9e / Auto: #4caf50
    let actionColor = "var(--state-climate-off-color, var(--disabled-color, #9e9e9e))";
    if (isCooling || hvacMode === "cool") {
      actionColor = "var(--state-climate-cool-color, var(--state-cool-color, #71bcf9))";
    } else if (isHeating || hvacMode === "heat") {
      actionColor = "var(--state-climate-heat-color, var(--state-heat-color, #ff9e6b))";
    } else if (hvacMode === "auto" || hvacMode === "heat_cool") {
      actionColor = "var(--state-climate-auto-color, var(--state-auto-color, #4caf50))";
    } else if (hvacMode === "dry") {
      actionColor = "var(--state-climate-dry-color, #ef6c00)";
    }

    return {
      hvacMode,
      hvacAction,
      isAvailable: true,
      isHeating,
      isCooling,
      isOff,
      actionColor,
      stateText
    };
  }

  _fireMoreInfo(entityId) {
    if (!entityId) return;
    const event = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId }
    });
    this.dispatchEvent(event);
  }

  _clampTargetTemp(temp) {
    const stateObj = this._hass?.states[this._config?.entity];
    const min = this._config?.min_temp ?? stateObj?.attributes?.min_temp ?? 16;
    const max = this._config?.max_temp ?? stateObj?.attributes?.max_temp ?? 30;
    const step = this._config?.step ?? stateObj?.attributes?.target_temp_step ?? 0.5;

    let bounded = Math.max(min, Math.min(max, temp));
    bounded = Math.round(bounded / step) * step;
    // Avoid floating point precision artifacts (e.g. 21.000000000000004)
    return Number(bounded.toFixed(2));
  }

  /**
   * Updates the dial knob, active arc, and temperature numbers in-place during pointer drag
   * without replacing shadowRoot.innerHTML or spamming HA services.
   */
  _updateSliderVisuals(targetTemp) {
    const root = this.shadowRoot;
    if (!root) return;

    const stateObj = this._hass?.states[this._config.entity];
    const minTemp = this._config.min_temp ?? stateObj?.attributes?.min_temp ?? 16;
    const maxTemp = this._config.max_temp ?? stateObj?.attributes?.max_temp ?? 30;
    const currentTemp = stateObj?.attributes?.current_temperature ?? 21.0;
    const modeInfo = this._getClimateModeInfo(stateObj);

    const cx = 160;
    const cy = 160;
    const r = 145;
    const startAngle = 135;
    const sweepTotal = 270;

    const tempToAngle = (t) => {
      const frac = Math.max(0, Math.min(1, (t - minTemp) / (maxTemp - minTemp)));
      return startAngle + frac * sweepTotal;
    };

    const targetAngle = tempToAngle(targetTemp);
    const currentAngle = tempToAngle(currentTemp);
    const targetPos = polarToXY(cx, cy, r, targetAngle);

    const handleEl = root.getElementById("target-handle");
    if (handleEl) {
      handleEl.setAttribute("cx", targetPos.x.toFixed(2));
      handleEl.setAttribute("cy", targetPos.y.toFixed(2));
    }

    const activeArcEl = root.getElementById("track-active");
    if (activeArcEl) {
      let activeArcPath = "";
      if (modeInfo.isCooling || modeInfo.hvacMode === "cool") {
        activeArcPath = describeArc(cx, cy, r, targetAngle, startAngle + sweepTotal);
      } else if (modeInfo.isHeating || modeInfo.hvacMode === "heat") {
        activeArcPath = describeArc(cx, cy, r, startAngle, targetAngle);
      } else if (modeInfo.hvacMode === "auto" || modeInfo.hvacMode === "heat_cool") {
        const aMin = Math.min(currentAngle, targetAngle);
        const aMax = Math.max(currentAngle, targetAngle);
        activeArcPath = describeArc(cx, cy, r, aMin, aMax);
      }
      activeArcEl.setAttribute("d", activeArcPath);
    }

    const primaryIsCurrent = this._config.show_current_as_primary !== false;
    const formatted = Number(targetTemp).toFixed(1).replace(".", ",");
    if (!primaryIsCurrent) {
      const [pInt, pDec] = formatted.split(",");
      const intEl = root.getElementById("primary-temp-int");
      const decEl = root.getElementById("primary-temp-dec");
      if (intEl) intEl.textContent = pInt;
      if (decEl) decEl.textContent = `,${pDec ?? "0"}`;
    } else {
      const secEl = root.getElementById("secondary-temp-val");
      if (secEl) secEl.textContent = `${formatted} °C`;
    }
  }

  _setTemperature(temp, commit = true) {
    if (!this._hass || !this._config.entity) return;
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj) return;

    const bounded = this._clampTargetTemp(temp);
    this._tempPending = bounded;

    if (!commit) {
      this._updateSliderVisuals(bounded);
      return;
    }

    if (this._pendingTimer) {
      clearTimeout(this._pendingTimer);
    }

    this._render();

    this._hass.callService("climate", "set_temperature", {
      entity_id: this._config.entity,
      temperature: bounded
    });

    this._pendingTimer = setTimeout(() => {
      this._tempPending = null;
      this._pendingTimer = null;
      this._render();
    }, 1500);
  }

  _callCustomAction(target) {
    if (!this._hass || !target) return;
    if (typeof target === "string") {
      const parts = target.split(".");
      if (parts.length === 2) {
        const [domain, name] = parts;
        if (domain === "script") {
          this._hass.callService("script", name, {});
        } else if (domain === "button" || domain === "input_button") {
          this._hass.callService(domain, "press", { entity_id: target });
        } else if (domain === "switch" || domain === "input_boolean" || domain === "light") {
          this._hass.callService("homeassistant", "toggle", { entity_id: target });
        } else {
          this._hass.callService(domain, name, {});
        }
        return;
      }
    } else if (typeof target === "object" && target.service) {
      const parts = target.service.split(".");
      if (parts.length === 2) {
        this._hass.callService(parts[0], parts[1], target.data || target.target || {});
      }
    }
  }

  _changeTempStep(delta) {
    // 1. Custom Events (script, button, switch, etc.)
    const upTarget = this._config.event_up;
    const downTarget = this._config.event_down;

    if (delta > 0 && upTarget) {
      this._callCustomAction(upTarget);
      return;
    }
    if (delta < 0 && downTarget) {
      this._callCustomAction(downTarget);
      return;
    }

    // 2. Standard Home Assistant climate.set_temperature
    const stateObj = this._hass?.states[this._config?.entity];
    if (!stateObj) return;
    const step = this._config.step ?? stateObj.attributes?.target_temp_step ?? 0.5;
    const current = this._tempPending ?? stateObj.attributes?.temperature ?? 20;
    this._setTemperature(current + delta * step, true);
  }

  _setPreset(preset) {
    if (!this._hass || !this._config.entity) return;
    const stateObj = this._hass.states[this._config.entity];
    const availablePresets = stateObj?.attributes?.preset_modes || [];
    const norm = this._normalizeKey(preset);

    // Match exact entity preset string case-insensitively if available
    const match = availablePresets.find(p => this._normalizeKey(p) === norm) || preset;

    this._hass.callService("climate", "set_preset_mode", {
      entity_id: this._config.entity,
      preset_mode: match
    });
  }

  _setHvacMode(mode) {
    if (!this._hass || !this._config.entity) return;
    this._hass.callService("climate", "set_hvac_mode", {
      entity_id: this._config.entity,
      hvac_mode: mode
    });
  }

  _triggerReset() {
    if (!this._hass || !this._config.entity) return;
    if (this._resetTimer) clearTimeout(this._resetTimer);

    this._resetSpinning = true;
    this._render();

    const resetTarget = this._config.event_reset;
    if (resetTarget) {
      this._callCustomAction(resetTarget);
    } else {
      this._hass.callService("homeassistant", "update_entity", {
        entity_id: this._config.entity
      });
      if (this._config.valve_entity) {
        this._hass.callService("homeassistant", "update_entity", {
          entity_id: this._config.valve_entity
        });
      }
    }

    this._resetTimer = setTimeout(() => {
      this._resetSpinning = false;
      this._resetTimer = null;
      this._render();
    }, 700);
  }

  _updateCard() {
    if (!this._config) return;
    this._render();
  }

  _render() {
    const t = this._t();
    const stateObj = this._hass?.states[this._config.entity];
    const name = this._config.name || stateObj?.attributes?.friendly_name || t.default_name;

    const minTemp = this._config.min_temp ?? stateObj?.attributes?.min_temp ?? 16;
    const maxTemp = this._config.max_temp ?? stateObj?.attributes?.max_temp ?? 30;
    const hasCurrentTemp = stateObj?.attributes?.current_temperature !== undefined && stateObj?.attributes?.current_temperature !== null;
    const hasTargetTemp = stateObj?.attributes?.temperature !== undefined && stateObj?.attributes?.temperature !== null;

    const currentTemp = hasCurrentTemp ? Number(stateObj.attributes.current_temperature) : 21.0;
    const targetTemp = this._tempPending !== null
      ? this._tempPending
      : (hasTargetTemp ? Number(stateObj.attributes.temperature) : 21.0);

    const modeInfo = this._getClimateModeInfo(stateObj);
    const humidity = this._getHumidityState(stateObj);
    const valve = this._getValveState();
    const heater = this._getTowelHeaterState();
    const windowsList = this._getEntitiesList(this._config.windows);
    const balconiesList = this._getEntitiesList(this._config.balconies);

    // Number formatting matching HA big number (Integer huge, decimal + unit stacked)
    // Default: Temperatura attuale grande, Setpoint sotto
    const primaryIsCurrent = this._config.show_current_as_primary !== false;
    const primaryVal = primaryIsCurrent ? currentTemp : targetTemp;
    const secondaryVal = primaryIsCurrent ? targetTemp : currentTemp;

    let pInt = "--";
    let pDec = "0";
    let secondaryFormatted = "--";

    if (modeInfo.isAvailable) {
      const primaryFormatted = Number(primaryVal).toFixed(1).replace(".", ",");
      [pInt, pDec] = primaryFormatted.split(",");
      secondaryFormatted = Number(secondaryVal).toFixed(1).replace(".", ",");
    }

    // Exact Home Assistant circular slider geometry
    // Center: 160, 160. Radius: 145.
    // MAX_ANGLE = 270 deg. Starts at 135 deg, sweeps 270 deg clockwise to 405 deg (= 45 deg).
    const cx = 160;
    const cy = 160;
    const r = 145;
    const startAngle = 135;
    const sweepTotal = 270;

    const tempToAngle = (tempVal) => {
      const frac = Math.max(0, Math.min(1, (tempVal - minTemp) / (maxTemp - minTemp)));
      return startAngle + frac * sweepTotal;
    };

    const targetAngle = tempToAngle(targetTemp);
    const currentAngle = tempToAngle(currentTemp);

    // Background track (270 deg full arc)
    const bgArcPath = describeArc(cx, cy, r, startAngle, startAngle + sweepTotal);

    // Active arc path according to HVAC action/mode (Start mode for heating, End mode for cooling)
    let activeArcPath = "";
    if (modeInfo.isAvailable) {
      if (modeInfo.isCooling || modeInfo.hvacMode === "cool") {
        activeArcPath = describeArc(cx, cy, r, targetAngle, startAngle + sweepTotal);
      } else if (modeInfo.isHeating || modeInfo.hvacMode === "heat") {
        activeArcPath = describeArc(cx, cy, r, startAngle, targetAngle);
      } else if (modeInfo.hvacMode === "auto" || modeInfo.hvacMode === "heat_cool") {
        const aMin = Math.min(currentAngle, targetAngle);
        const aMax = Math.max(currentAngle, targetAngle);
        activeArcPath = describeArc(cx, cy, r, aMin, aMax);
      }
    }

    // Coordinates for the target handle knob and current temp indicator
    const targetPos = polarToXY(cx, cy, r, targetAngle);
    const currentPos = polarToXY(cx, cy, r, currentAngle);

    // Feature buttons: Presets matching Home Assistant features: [type: climate-preset-modes]
    const presets = this._getPresetList(stateObj);
    const currentPreset = stateObj?.attributes?.preset_mode;
    const currentPresetNorm = this._normalizeKey(currentPreset);
    const presetStyle = this._config.preset_style || "icons";

    // Feature buttons: HVAC modes matching Home Assistant features: [type: climate-hvac-modes]
    const hvacModes = this._getHvacList(stateObj);
    const hvacStyle = this._config.hvac_style || "icons";

    const sliderDisabled = Boolean(
      this._config.disable_slider ||
      (this._config.event_up && this._config.disable_slider !== false)
    );

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          position: relative;
          font-family: var(--ha-card-font-family, var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
          -webkit-font-smoothing: antialiased;
        }

        * {
          box-sizing: border-box;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Original Home Assistant ha-card styles */
        ha-card, .ha-card-container {
          position: relative;
          width: 100%;
          background: var(--ha-card-background, var(--card-background-color, #ffffff));
          border-radius: var(--ha-card-border-radius, 12px);
          border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e5e7eb));
          box-shadow: var(--ha-card-box-shadow, none);
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        /* Header matching hui-thermostat-card */
        .title {
          width: 100%;
          font-size: var(--ha-font-size-l, 16px);
          font-weight: 500;
          line-height: var(--ha-line-height-expanded, 24px);
          padding: 12px 68px 4px 68px;
          margin: 0;
          text-align: center;
          color: var(--primary-text-color, #212121);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: none;
        }

        .header-actions {
          position: absolute;
          top: 6px;
          right: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 5;
        }

        .icon-btn-ghost {
          background: transparent;
          border: none;
          color: var(--secondary-text-color, #727272);
          cursor: pointer;
          width: 32px;
          height: 32px;
          padding: 0;
          border-radius: var(--ha-border-radius-pill, 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s, color 0.15s, transform 0.15s;
        }
        .icon-btn-ghost svg {
          width: 18px;
          height: 18px;
        }
        .icon-btn-ghost:hover {
          color: var(--primary-text-color, #212121);
          background: rgba(var(--rgb-primary-text, 0, 0, 0), 0.06);
          transform: scale(1.08);
        }
        .icon-btn-ghost.spinning {
          animation: spin 0.7s ease-in-out;
        }

        /* Circular Slider container matching ha-state-control-climate-temperature */
        .slider-container {
          position: relative;
          width: 100%;
          max-width: 360px;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        /* Radial glow aura matching official ha-control-circular-slider::after */
        .glow-aura {
          position: absolute;
          top: 2%;
          left: 2%;
          right: 2%;
          bottom: 2%;
          background: radial-gradient(
            50% 50% at 50% 50%,
            ${modeInfo.actionColor} 0%,
            transparent 100%
          );
          opacity: 0.15;
          pointer-events: none;
          border-radius: 50%;
          transition: opacity 0.3s ease;
        }

        svg.circular-slider {
          width: 100%;
          height: 100%;
          overflow: visible;
          display: block;
          touch-action: ${sliderDisabled ? "auto" : "none"};
        }

        /* Track paths matching ha-control-circular-slider */
        .track-background {
          fill: none;
          stroke: var(--control-circular-slider-background, var(--disabled-color, #e0e0e0));
          stroke-width: 28px;
          stroke-linecap: round;
          opacity: var(--control-circular-slider-background-opacity, 0.28);
          transition: stroke 180ms ease-in-out, opacity 180ms ease-in-out;
        }

        .track-active {
          fill: none;
          stroke: ${modeInfo.actionColor};
          stroke-width: 28px;
          stroke-linecap: round;
          transition: stroke 200ms ease;
        }

        /* Current temp indicator on track */
        .indicator-current {
          fill: var(--primary-text-color, #212121);
          opacity: 0.65;
          transition: cx 0.2s, cy 0.2s;
        }

        /* Target knob matching HA .target & .target-border */
        .target-handle {
          fill: #ffffff;
          stroke: ${modeInfo.actionColor};
          stroke-width: 3.5px;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.28));
          cursor: ${sliderDisabled ? "default" : "grab"};
          transition: stroke 0.2s;
        }
        .target-handle:active {
          cursor: ${sliderDisabled ? "default" : "grabbing"};
        }

        /* Center Info matching ha-state-control-climate-temperature */
        .center-info {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          text-align: center;
          padding-bottom: 24px; /* leaves room for stepper buttons at bottom of dial */
        }

        /* Label (Action or Mode text) */
        .state-label {
          font-size: 15px;
          font-weight: 500;
          line-height: 1.3;
          color: ${modeInfo.actionColor};
          margin: 0 0 4px 0;
          text-transform: capitalize;
          transition: color 0.2s ease;
        }

        /* Big Number Component matching ha-big-number */
        .big-number {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          line-height: 1;
          color: var(--primary-text-color, #212121);
          margin: 2px 0;
        }

        .temp-integer {
          font-size: 58px;
          font-weight: 500;
          letter-spacing: -1.5px;
          line-height: 1;
        }

        .temp-addon {
          display: flex;
          flex-direction: column-reverse;
          padding: 2px 0 3px 2px;
          line-height: 1;
        }

        .temp-decimal {
          font-size: 22px;
          font-weight: 500;
          line-height: 1.2;
        }

        .temp-unit {
          font-size: 16px;
          font-weight: 500;
          line-height: 1;
          margin-bottom: 2px;
          color: var(--secondary-text-color, #727272);
        }

        /* Secondary line (Current temp or Target temp) */
        .secondary-line {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 400;
          color: var(--secondary-text-color, #727272);
          margin-top: 4px;
        }
        .secondary-line svg {
          color: var(--secondary-text-color, #727272);
        }

        /* Humidity under current temp */
        .humidity-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 500;
          color: var(--secondary-text-color, #64748b);
          margin-top: 3px;
          pointer-events: auto;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 8px;
          transition: background-color 0.15s;
        }
        .humidity-badge:hover {
          background: rgba(var(--rgb-primary-text, 0, 0, 0), 0.05);
        }
        .humidity-badge svg {
          color: #0284c7;
        }

        /* INTEGRATED FIXTURES (Balconies & Windows) */
        .fixtures-container {
          position: absolute;
          right: 46px;
          top: 26%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 4;
          pointer-events: auto;
        }

        .fixture-pill {
          background: rgba(var(--rgb-card-background-color, 255, 255, 255), 0.95);
          border: 1px solid var(--divider-color, #e5e7eb);
          border-radius: var(--ha-border-radius-pill, 50%);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--primary-color, #0284c7);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          transition: transform 0.15s, border-color 0.15s, color 0.15s;
        }
        .fixture-pill:hover {
          transform: scale(1.12);
          border-color: var(--primary-color, #0284c7);
        }
        .fixture-pill.alert-open {
          color: #ef4444;
          border-color: #ef4444;
          animation: pulse-alert 1.8s infinite;
        }

        @keyframes pulse-alert {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
        }

        /* INTEGRATED ZONE VALVE (Right corner) */
        .valve-badge {
          position: absolute;
          right: 24px;
          bottom: 18px;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 4;
          cursor: pointer;
          pointer-events: auto;
          background: rgba(var(--rgb-card-background-color, 255, 255, 255), 0.95);
          padding: 3px 8px 3px 6px;
          border-radius: 8px;
          border: 1px solid var(--divider-color, #e5e7eb);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          transition: border-color 0.15s, transform 0.15s;
        }
        .valve-badge:hover {
          transform: scale(1.05);
          border-color: ${modeInfo.actionColor};
        }
        .valve-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${valve?.isOpen ? modeInfo.actionColor : 'var(--secondary-text-color, #727272)'};
        }
        .valve-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary-text-color, #212121);
          line-height: 1;
        }

        /* INTEGRATED TOWEL HEATER / TERMOARREDO (Specular Left corner) */
        .heater-badge {
          position: absolute;
          left: 24px;
          bottom: 18px;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 4;
          cursor: pointer;
          pointer-events: auto;
          background: rgba(var(--rgb-card-background-color, 255, 255, 255), 0.95);
          padding: 3px 8px 3px 6px;
          border-radius: 8px;
          border: 1px solid var(--divider-color, #e5e7eb);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          transition: border-color 0.15s, transform 0.15s, background-color 0.2s;
        }
        .heater-badge:hover {
          transform: scale(1.05);
          border-color: var(--state-climate-heat-color, #ff9e6b);
        }
        .heater-badge.active {
          border-color: var(--state-climate-heat-color, #ff9e6b);
        }
        .heater-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${heater?.isOn ? 'var(--state-climate-heat-color, #ff9e6b)' : 'var(--secondary-text-color, #727272)'};
        }
        .heater-text {
          font-size: 12px;
          font-weight: 600;
          color: ${heater?.isOn ? 'var(--state-climate-heat-color, #ff9e6b)' : 'var(--secondary-text-color, #727272)'};
          line-height: 1;
        }

        /* Stepper buttons matching official ha-state-control-climate-temperature .buttons */
        .stepper-controls {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          margin: 0 auto;
          gap: 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 4;
        }

        .step-button {
          pointer-events: auto;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--ha-outlined-icon-button-outline-color, var(--divider-color, #e5e7eb));
          background: var(--ha-card-background, var(--card-background-color, #ffffff));
          color: var(--primary-text-color, #212121);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s, border-color 0.15s, transform 0.1s;
        }
        .step-button:hover {
          background: rgba(var(--rgb-primary-text, 0, 0, 0), 0.05);
          border-color: var(--secondary-text-color, #94a3b8);
        }
        .step-button:active {
          transform: scale(0.94);
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* Card features row matching official hui-card-features */
        .features-row {
          width: 100%;
          box-sizing: border-box;
          padding: 0 12px 12px 12px;
          flex: none;
        }

        .features-pill-group {
          display: flex;
          align-items: center;
          justify-content: stretch;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }

        .feature-btn {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--secondary-text-color, #727272);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, color 0.2s, transform 0.1s;
        }
        .feature-btn:hover {
          color: var(--primary-text-color, #212121);
          background: rgba(var(--rgb-primary-text, 0, 0, 0), 0.05);
        }
        .feature-btn:active {
          transform: scale(0.96);
        }
        .feature-btn.active {
          color: #ffffff;
          background: ${modeInfo.actionColor};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        .feature-select {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 1px solid var(--divider-color, #e5e7eb);
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
          color: var(--primary-text-color, #212121);
          padding: 0 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }
      </style>

      <ha-card class="ha-card-container">
        <!-- Title & Header Actions -->
        <p class="title" id="title">${escapeHtml(name)}</p>
        
        <div class="header-actions">
          <button class="icon-btn-ghost ${this._resetSpinning ? 'spinning' : ''}" id="btn-reset-header" title="${escapeHtml(t.reset_tooltip)}">
            ${ICONS.refresh}
          </button>
          <button class="icon-btn-ghost" id="btn-more-info" title="${escapeHtml(t.more_info_tooltip)}">
            ${ICONS.dots_vertical}
          </button>
        </div>

        <!-- 320x320 Circular Slider Container -->
        <div class="slider-container" id="slider-container">
          <!-- Radial glow behind the dial -->
          <div class="glow-aura"></div>

          <!-- SVG Dial -->
          <svg class="circular-slider" id="circular-slider" viewBox="0 0 320 320">
            <!-- Background grey track (270 deg) -->
            <path class="track-background" d="${bgArcPath}" />

            <!-- Active colored arc -->
            <path class="track-active" id="track-active" d="${activeArcPath}" />

            <!-- Current temperature position dot -->
            ${modeInfo.isAvailable ? `
              <circle class="indicator-current" cx="${currentPos.x.toFixed(2)}" cy="${currentPos.y.toFixed(2)}" r="4.5" />
              <circle class="target-handle" id="target-handle" cx="${targetPos.x.toFixed(2)}" cy="${targetPos.y.toFixed(2)}" r="12" />
            ` : ""}
          </svg>

          <!-- Center Info (Action label, big number, secondary current temp & humidity) -->
          <div class="center-info">
            <div class="state-label">${escapeHtml(modeInfo.stateText)}</div>

            <div class="big-number">
              <span class="temp-integer" id="primary-temp-int">${pInt}</span>
              ${modeInfo.isAvailable ? `
                <div class="temp-addon">
                  <span class="temp-decimal" id="primary-temp-dec">,${pDec ?? '0'}</span>
                  <span class="temp-unit">°C</span>
                </div>
              ` : ""}
            </div>

            <!-- Secondary temperature line: Setpoint if primary is current, otherwise Attuale -->
            <div class="secondary-line" title="${escapeHtml(primaryIsCurrent ? t.target_temp_tooltip : t.current_temp_tooltip)}">
              ${primaryIsCurrent ? ICONS.target : ICONS.thermometer}
              <span id="secondary-temp-val">${secondaryFormatted} °C</span>
            </div>

            <!-- Humidity under current temp -->
            ${humidity !== null ? `
              <div class="humidity-badge" id="btn-humidity" data-entity="${escapeHtml(humidity.entity_id)}" title="${escapeHtml(t.humidity_tooltip)}">
                ${ICONS.water_percent}
                <span>${humidity.value}%</span>
              </div>
            ` : ""}
          </div>

          <!-- Integrated Fixtures (Balconies & Windows) -->
          ${(balconiesList.length > 0 || windowsList.length > 0) ? `
            <div class="fixtures-container">
              ${balconiesList.map(b => `
                <button class="fixture-pill ${b.isOpen ? 'alert-open' : ''}"
                  data-entity="${escapeHtml(b.entity_id)}"
                  title="${escapeHtml(b.name || t.balcony_default)}: ${escapeHtml(b.isOpen ? t.open_m : t.closed_m)}">
                  ${b.isOpen ? ICONS.balcony_open : ICONS.balcony_closed}
                </button>
              `).join("")}
              ${windowsList.map(w => `
                <button class="fixture-pill ${w.isOpen ? 'alert-open' : ''}"
                  data-entity="${escapeHtml(w.entity_id)}"
                  title="${escapeHtml(w.name || t.window_default)}: ${escapeHtml(w.isOpen ? t.open_f : t.closed_f)}">
                  ${w.isOpen ? ICONS.window_open : ICONS.window_closed}
                </button>
              `).join("")}
            </div>
          ` : ""}

          <!-- Integrated Towel Heater (Termoarredo) Badge - Left corner -->
          ${heater ? `
            <div class="heater-badge ${heater.isOn ? 'active' : ''}" id="btn-heater" title="${escapeHtml(heater.name)} (${escapeHtml(heater.display)}) - ${escapeHtml(t.towel_heater_tooltip)}">
              <span class="heater-icon">${ICONS.heating_coil}</span>
              <span class="heater-text">${escapeHtml(heater.display)}</span>
            </div>
          ` : ""}

          <!-- Integrated Zone Valve Badge - Right corner -->
          ${valve ? `
            <div class="valve-badge" id="btn-valve" title="${escapeHtml(t.valve_tooltip)} (${escapeHtml(valve.display)})">
              <span class="valve-icon">${ICONS.valve}</span>
              <span class="valve-text">${escapeHtml(valve.display)}</span>
            </div>
          ` : ""}

          <!-- Stepper Buttons Row (- and + only) -->
          <div class="stepper-controls">
            <button class="step-button" id="btn-minus" title="${escapeHtml(t.step_down_tooltip)}">
              ${ICONS.minus}
            </button>
            <button class="step-button" id="btn-plus" title="${escapeHtml(t.step_up_tooltip)}">
              ${ICONS.plus}
            </button>
          </div>
        </div>

        <!-- Segmented Features Row matching official hui-card-features -->
        ${(presets?.length > 0 || hvacModes?.length > 0) ? `
          <div class="features-row">
            ${presets?.length > 0 ? (
              presetStyle === "dropdown" ? `
                <select class="feature-select" id="select-preset">
                  ${presets.map(preset => {
                    const norm = this._normalizeKey(preset);
                    const isActive = currentPresetNorm === norm;
                    const label = this._getPresetLabel(preset);
                    return `<option value="${escapeHtml(preset)}" ${isActive ? "selected" : ""}>${escapeHtml(label)}</option>`;
                  }).join("")}
                </select>
              ` : `
                <div class="features-pill-group">
                  ${presets.map(preset => {
                    const norm = this._normalizeKey(preset);
                    const isActive = currentPresetNorm === norm;
                    const iconSvg = this._getPresetIcon(preset);
                    const label = this._getPresetLabel(preset);
                    return `
                      <button class="feature-btn ${isActive ? 'active' : ''}"
                        data-preset="${escapeHtml(preset)}"
                        title="${escapeHtml(label)}">
                        ${iconSvg}
                      </button>
                    `;
                  }).join("")}
                </div>
              `
            ) : ""}

            ${hvacModes?.length > 0 ? (
              hvacStyle === "dropdown" ? `
                <select class="feature-select" id="select-hvac" style="${presets?.length > 0 ? 'margin-top: 6px;' : ''}">
                  ${hvacModes.map(mode => {
                    const isActive = modeInfo.hvacMode === mode;
                    const label = this._getHvacLabel(mode);
                    return `<option value="${escapeHtml(mode)}" ${isActive ? "selected" : ""}>${escapeHtml(label)}</option>`;
                  }).join("")}
                </select>
              ` : `
                <div class="features-pill-group" style="${presets?.length > 0 ? 'margin-top: 6px;' : ''}">
                  ${hvacModes.map(mode => {
                    const isActive = modeInfo.hvacMode === mode;
                    const iconSvg = this._getHvacIcon(mode);
                    const label = this._getHvacLabel(mode);
                    return `
                      <button class="feature-btn ${isActive ? 'active' : ''}"
                        data-hvac-mode="${escapeHtml(mode)}"
                        title="${escapeHtml(label)}">
                        ${iconSvg}
                      </button>
                    `;
                  }).join("")}
                </div>
              `
            ) : ""}
          </div>
        ` : ""}
      </ha-card>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const root = this.shadowRoot;

    // Header More-Info
    root.getElementById("btn-more-info")?.addEventListener("click", () => {
      this._fireMoreInfo(this._config.entity);
    });

    // Stepper buttons
    root.getElementById("btn-minus")?.addEventListener("click", () => this._changeTempStep(-1));
    root.getElementById("btn-plus")?.addEventListener("click", () => this._changeTempStep(1));

    // Reset button in header
    root.getElementById("btn-reset-header")?.addEventListener("click", () => this._triggerReset());

    // Humidity More-Info
    root.getElementById("btn-humidity")?.addEventListener("click", (ev) => {
      const entityId = ev.currentTarget.getAttribute("data-entity") || this._config.humidity_entity || this._config.entity;
      if (entityId) this._fireMoreInfo(entityId);
    });

    // Valve More-Info
    root.getElementById("btn-valve")?.addEventListener("click", () => {
      if (this._config.valve_entity) this._fireMoreInfo(this._config.valve_entity);
    });

    // Towel Heater (Termoarredo) Toggle
    root.getElementById("btn-heater")?.addEventListener("click", () => {
      const entityId = this._config.towel_heater;
      if (entityId) this._toggleTowelHeater(entityId);
    });

    // Fixture icons (Balconies & Windows)
    root.querySelectorAll(".fixture-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const entityId = btn.getAttribute("data-entity");
        if (entityId) this._fireMoreInfo(entityId);
      });
    });

    // Feature buttons (Presets)
    root.querySelectorAll(".feature-btn[data-preset]").forEach(btn => {
      btn.addEventListener("click", () => {
        const preset = btn.getAttribute("data-preset");
        if (preset) this._setPreset(preset);
      });
    });

    root.getElementById("select-preset")?.addEventListener("change", (ev) => {
      if (ev.target.value) this._setPreset(ev.target.value);
    });

    // Feature buttons (HVAC Modes)
    root.querySelectorAll(".feature-btn[data-hvac-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-hvac-mode");
        if (mode) this._setHvacMode(mode);
      });
    });

    root.getElementById("select-hvac")?.addEventListener("change", (ev) => {
      if (ev.target.value) this._setHvacMode(ev.target.value);
    });

    // Circular Slider dragging (smooth in-place DOM updates, single service call on release)
    const sliderSvg = root.getElementById("circular-slider");
    if (sliderSvg) {
      const stateObj = this._hass?.states[this._config.entity];
      const minTemp = this._config.min_temp ?? stateObj?.attributes?.min_temp ?? 16;
      const maxTemp = this._config.max_temp ?? stateObj?.attributes?.max_temp ?? 30;

      const computePointerTemp = (e) => {
        const rect = sliderSvg.getBoundingClientRect();
        // 320x320 viewBox, center is (160, 160)
        const scale = 320 / rect.width;
        const x = (e.clientX - rect.left) * scale - 160;
        const y = (e.clientY - rect.top) * scale - 160;

        let deg = (Math.atan2(y, x) * 180) / Math.PI;
        if (deg < 0) deg += 360;

        // Active range is 135 deg to 405 deg (45 deg)
        let mappedDeg = deg;
        if (deg < 135 && deg > 45) {
          mappedDeg = deg < 90 ? 45 : 135;
        } else if (deg <= 45) {
          mappedDeg = deg + 360;
        }

        const frac = Math.max(0, Math.min(1, (mappedDeg - 135) / 270));
        return minTemp + frac * (maxTemp - minTemp);
      };

      sliderSvg.addEventListener("pointerdown", (e) => {
        // Prevent continuous touch drag if custom step events or disable_slider is configured
        if (this._config.disable_slider || (this._config.event_up && this._config.disable_slider !== false)) {
          return;
        }
        this._isDragging = true;
        try { sliderSvg.setPointerCapture(e.pointerId); } catch (_) {}
        const newTemp = computePointerTemp(e);
        this._setTemperature(newTemp, false);
      });

      sliderSvg.addEventListener("pointermove", (e) => {
        if (!this._isDragging) return;
        const newTemp = computePointerTemp(e);
        this._setTemperature(newTemp, false);
      });

      const stopDrag = (e) => {
        if (!this._isDragging) return;
        this._isDragging = false;
        try { sliderSvg.releasePointerCapture(e.pointerId); } catch (_) {}
        if (this._tempPending !== null) {
          this._setTemperature(this._tempPending, true);
        }
      };

      sliderSvg.addEventListener("pointerup", stopDrag);
      sliderSvg.addEventListener("pointercancel", stopDrag);
    }
  }
}

// Visual Editor for Home Assistant UI
class ClimateCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._initialized = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) {
      this._form.hass = hass;
      this._form.computeLabel = (s) => this._computeLabel(s);
    } else {
      this._init();
    }
  }

  setConfig(config) {
    this._config = { ...config };
    if (this._form) {
      this._form.data = this._config;
    } else {
      this._init();
    }
  }

  _getSchema() {
    return [
      {
        name: "entity",
        required: true,
        selector: { entity: { domain: "climate" } }
      },
      {
        name: "name",
        selector: { text: {} }
      },
      {
        name: "valve_entity",
        selector: { entity: {} }
      },
      {
        name: "towel_heater",
        selector: { entity: { domain: ["switch", "climate", "input_boolean"] } }
      },
      {
        name: "windows",
        selector: { entity: { domain: "binary_sensor", multiple: true } }
      },
      {
        name: "balconies",
        selector: { entity: { domain: "binary_sensor", multiple: true } }
      },
      {
        name: "humidity_entity",
        selector: { entity: { domain: "sensor" } }
      },
      {
        name: "show_current_as_primary",
        selector: { boolean: {} }
      },
      {
        name: "disable_slider",
        selector: { boolean: {} }
      },
      {
        name: "event_up",
        selector: { entity: { domain: ["script", "button", "switch", "input_button"] } }
      },
      {
        name: "event_down",
        selector: { entity: { domain: ["script", "button", "switch", "input_button"] } }
      },
      {
        name: "event_reset",
        selector: { entity: { domain: ["script", "button", "switch", "input_button"] } }
      }
    ];
  }

  _computeLabel(schema) {
    const lang = getLang(this._hass, this._config?.language);
    const t = TRANSLATIONS[lang] || TRANSLATIONS.it;
    return t.editor[schema.name] || schema.name;
  }

  _init() {
    if (!this._config || this._initialized) return;
    this._initialized = true;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-form {
          display: block;
        }
      </style>
    `;

    this._form = document.createElement("ha-form");
    this._form.schema = this._getSchema();
    this._form.computeLabel = (s) => this._computeLabel(s);
    if (this._hass) this._form.hass = this._hass;
    this._form.data = this._config;

    this._form.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      const newConfig = { ...this._config, ...ev.detail.value };
      this._config = newConfig;
      this.dispatchEvent(new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: newConfig }
      }));
    });

    this.shadowRoot.appendChild(this._form);
  }
}

customElements.define("climate-card", ClimateCard);
customElements.define("climate-card-editor", ClimateCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "climate-card",
  name: "Climate Card (con Finestre, Valvola e Umidità)",
  preview: true,
  description: "Card clima basata sulle forme, geometrie e colori originali della Thermostat card di Home Assistant con finestre, balconi, valvola e umidità integrati."
});
