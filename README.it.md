# Custom Climate Card per Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/default)
[![GitHub release](https://img.shields.io/github/v/release/evlas/climate-card?style=flat-square&color=blue)](https://github.com/evlas/climate-card/releases)
[![HACS Validate](https://img.shields.io/github/actions/workflow/status/evlas/climate-card/validate.yml?label=HACS%20Action&style=flat-square)](https://github.com/evlas/climate-card/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Community Forum](https://img.shields.io/badge/Community-Forum-brightgreen.svg?style=flat-square)](https://community.home-assistant.io/)
[![English](https://img.shields.io/badge/Language-English-blue?style=flat-square)](README.md)
[![Italiano](https://img.shields.io/badge/Lingua-Italiano-green?style=flat-square)](README.it.md)

Una card personalizzata per **Home Assistant Lovelace** creata per essere **del tutto identica alla card standard Thermostat** di Home Assistant, arricchita con un layout perfettamente integrato (all-in-one):
- **Finestre e Balconi integrati all'interno della ghiera**: posizionati in colonna verticale a destra della temperatura, con cambio icona e colore rosso/allarme se aperti.
- **Valvola di zona con percentuale**: posizionata elegantemente in basso a destra all'interno della ghiera con box e valore percentuale (es. `[|/|] 0%`).
- **Regolazione temperatura tramite pulsanti `−` e `+`**: supporta sia il controllo standard Home Assistant, sia eventi personalizzati (`event_up` / `event_down`) per script, pulsanti o switch.
- **Pulsante di Reset `↻` fisso in alto a destra**: posizionato stabilmente nell'intestazione della card accanto ai tre puntini, per ripristinare il setpoint tramite `event_reset` o aggiornare l'entità.
- **Doppia modalità Grafica**: Estate (Raffreddamento in azzurro `#71bcf9`) e Inverno (Riscaldamento in arancione `#ff9e6b`).
- **Supporto Editor Visuale UI**: configurabile sia direttamente dall'interfaccia grafica Lovelace (tramite `<ha-form>`) che via YAML.

---

## 📁 File del Progetto

- [`climate-card.js`](file:///home/vito/Documenti/GitLocale/climate-card/climate-card.js): Il componente Web Component pronto per Home Assistant.
- [`index.html`](file:///home/vito/Documenti/GitLocale/climate-card/index.html): Pagina di anteprima/test interattiva per simulare il comportamento in locale.

---

## 🚀 Installazione in Home Assistant

### Metodo 1: Installazione Manuale (Consigliato)
1. Copia il file [`climate-card.js`](file:///home/vito/Documenti/GitLocale/climate-card/climate-card.js) nella cartella `www` della tua configurazione di Home Assistant:
   ```bash
   /config/www/climate-card.js
   ```
2. In Home Assistant vai su **Impostazioni** > **Dashboard** > menu in alto a destra (**tre puntini**) > **Risorse**.
3. Clicca **Aggiungi Risorsa**:
   - **URL**: `/local/climate-card.js`
   - **Tipo di risorsa**: `Modulo JavaScript`
4. Ricarica la pagina del browser (o svuota la cache con `Ctrl+F5`).

---

## ⚙️ Configurazione

Puoi aggiungere la card cliccando su **Aggiungi Card** nella dashboard e cercando **Climate Card (con Finestre, Valvola e Umidità)** nell'editor visuale, oppure inserendo direttamente il codice YAML.

---

### Configuration Variables

| Variabile | Tipo | Obbligatorio | Default | Descrizione |
| :--- | :--- | :--- | :--- | :--- |
| `type` | `string` | **Sì** | - | `custom:climate-card` (equivalente della card `thermostat` ufficiale). |
| `entity` | `string` | **Sì** | - | Entity ID del dominio `climate` o `water_heater` (es. `climate.salotto`). |
| `name` | `string` | No | `friendly_name` | Sovrascrive il nome visualizzato nell'intestazione. |
| `theme` | `string` | No | - | Sovrascrive il tema per questa specifica card con un qualsiasi tema caricato. |
| `show_current_as_primary` | `boolean` | No | `true` | Mostra la temperatura attuale come informazione principale grande al centro. La temperatura di setpoint viene visualizzata sotto come informazione secondaria. (Nella card standard HA è `false`). |
| `features` | `list` | No | - | Widget aggiuntivi per controllare l'entità. Supporta le specifiche ufficiali [Home Assistant Dashboard Features](https://www.home-assistant.io/dashboards/features). |
| `step` | `number` | No | `0.5` | Passo di regolazione della temperatura per i tasti `+` e `−` (se omesso usa `target_temp_step` dell'entità). |
| `min_temp` | `number` | No | `16` | Limite minimo della scala graduata (se omesso usa `min_temp` dell'entità). |
| `max_temp` | `number` | No | `30` | Limite massimo della scala graduata (se omesso usa `max_temp` dell'entità). |
| `disable_slider` | `boolean` | No | `false` | Disabilita il trascinamento touch della ghiera (consigliato se si vuole consentire la variazione esclusivamente a scatti tramite `+` e `−`). |

#### Eventi Personalizzati (Pulsanti `+`, `−`, `↻`)

I pulsanti `+`, `−` e il pulsante Reset `↻` (collocato stabilmente in alto a destra nell'intestazione accanto ai tre puntini) possono eseguire qualsiasi entità `script.*`, `button.*`, `switch.*`, `input_button.*`:

| Variabile | Tipo | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- |
| `event_up` | `string` | No | Entità richiamata alla pressione di `+` (`script.salotto_up`, `button.salotto_up`, `switch.boost`, ecc.). |
| `event_down` | `string` | No | Entità richiamata alla pressione di `−` (`script.salotto_down`, `button.salotto_down`, ecc.). |
| `event_reset` | `string` | No | Entità richiamata alla pressione del tasto Reset `↻` in alto a destra (`script.reset_salotto`, `button.reset`, ecc.). |

#### Sensori Ambiente Integrati

| Variabile | Tipo | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- |
| `valve_entity` | `string` | No | Entità valvola di zona (`sensor.*`, `number.*`, `valve.*`). Mostra la percentuale o lo stato in basso a destra con icona valvola (`mdi:valve`). |
| `towel_heater` | `string` | No | Entità termoarredo bagno (`switch.*`, `climate.*`, `input_boolean.*`). Posizionato specularmente in basso a sinistra con icona serpentina (`mdi:heating-coil`), cliccabile per accensione/spegnimento. |
| `windows` | `string` / `list` | No | Sensore finestra (`binary_sensor.*`) o lista di finestre integrati nella ghiera a destra. |
| `balconies` | `string` / `list` | No | Sensore balcone (`binary_sensor.*`) o lista di balconi/portefinestre integrati nella ghiera a destra. |
| `humidity_entity` | `string` | No | Sensore umidità (`sensor.*`). Se omesso, legge automaticamente l'attributo `current_humidity` del clima. |

---

## 🎛️ Dashboard Features (Specifiche Ufficiali Home Assistant)

La card integra pienamente il sistema di [Dashboard Features di Home Assistant](https://www.home-assistant.io/dashboards/features), permettendo di personalizzare sia la barra dei **Preset Modes**, sia la barra delle **Modalità HVAC**.

### 1. `climate-preset-modes`
Visualizza i pulsanti per commutare le modalità preimpostate (Preset Modes) dell'entità climate.

```yaml
features:
  - type: climate-preset-modes
    style: icons                         # "icons" (default) o "dropdown"
    preset_modes:
      - comfort                          # Icona divano (mdi:sofa)
      - standby                          # Icona orologio (mdi:clock-outline)
      - economy                          # Icona foglia (mdi:leaf)
      - building_protection              # Icona protezione edificio (mdi:shield-home)
```

- **Icone automatiche**: La card riconosce automaticamente sia le modalità standard HA (`home`, `away`, `eco`, `comfort`, `sleep`, `activity`, `boost`), sia le modalità KNX (`comfort`, `standby`, `economy`, `building_protection`, `frost_protection`).
- **Nomi e traduzioni**: I tooltip mostrano automaticamente le etichette localizzate in italiano (*Comfort*, *Standby*, *Economy*, *Protezione Edificio*).

### 2. `climate-hvac-modes`
Aggiunge la barra delle modalità operative di climatizzazione (Riscaldamento, Raffreddamento, Spento, ecc.):

```yaml
features:
  - type: climate-hvac-modes
    style: icons
    hvac_modes:
      - heat                             # Icona fuoco
      - cool                             # Icona fiocco di neve
      - auto                             # Icona rotazione
      - off                              # Icona spegnimento
```

### 3. Widget Specifici della Card all'interno di `features` (Opzionali)
Se preferisci una configurazione completamente modulare basata su `features`, puoi definire gli accessori della card direttamente nella lista:

```yaml
features:
  - type: climate-preset-modes
    style: icons
    preset_modes: [comfort, standby, economy, building_protection]
  - type: climate-card-valve
    entity: sensor.valvola_salotto
  - type: climate-card-towel-heater
    entity: switch.termoarredi_pt
  - type: climate-card-fixtures
    windows: binary_sensor.finestra_salotto
    balconies: binary_sensor.balcone_salotto
```

---

## 📋 Esempi di Configurazione YAML

### 1. Salotto con Script / Button / Switch (`event_up`, `event_down`, `event_reset`)
```yaml
type: custom:climate-card
entity: climate.salotto
name: Salotto
event_up: script.target_salotto_up       # oppure button.salotto_temp_up
event_down: script.target_salotto_down   # oppure button.salotto_temp_down
event_reset: script.reset_salotto        # oppure button.salotto_reset (richiamato da ↻ in alto a destra)
valve_entity: sensor.valvola_salotto
windows: binary_sensor.finestra_salotto
balconies: binary_sensor.balcone_salotto
humidity_entity: sensor.umidita_salotto
features:
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```

### 2. Bagno con Termoarredo e Valvola
```yaml
type: custom:climate-card
entity: climate.bagno
name: Bagno Padronale
towel_heater: switch.termoarredi_pt      # Termoarredo a sinistra (speculare alla valvola)
valve_entity: sensor.valvola_bagno       # Valvola a destra
windows: binary_sensor.finestra_bagno
features:
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```

### 3. Termostato con Entità Button (`button.salotto_up`, `button.salotto_down`)
```yaml
type: custom:climate-card
entity: climate.salotto
name: Salotto
event_up: button.salotto_up              # chiama button.press
event_down: button.salotto_down          # chiama button.press
event_reset: button.salotto_reset
valve_entity: sensor.valvola_salotto
features:
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```

### 4. Configurazione Combinata con Preset Modes e HVAC Modes
```yaml
type: custom:climate-card
entity: climate.camera
name: Camera da Letto
features:
  - type: climate-hvac-modes
    style: icons
    hvac_modes:
      - heat
      - cool
      - off
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```
