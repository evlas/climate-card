# Custom Climate Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/default)
[![GitHub release](https://img.shields.io/github/v/release/evlas/climate-card?include_prereleases&color=blue)](https://github.com/evlas/climate-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![English](https://img.shields.io/badge/Language-English-blue)](README.md)
[![Italiano](https://img.shields.io/badge/Lingua-Italiano-green)](README.it.md)

An all-in-one custom Lovelace card for **Home Assistant** designed to match the exact visual style, proportions, geometry, and colors of the official Home Assistant **Thermostat Card** (`hui-thermostat-card`), while seamlessly integrating room sensors and custom controls directly into the dial:

- **1:1 Official Look & Feel**: Built with the authentic 320x320 SVG geometry, circular slider, dynamic color gradients (Heating in `#ff9e6b`, Cooling in `#71bcf9`, Off in `#9e9e9e`), and native typography.
- **Inverted Display (Current Temp Primary)**: Shows the current room temperature large and prominent at the center (`58px`), with the setpoint temperature cleanly displayed underneath.
- **Integrated Fixtures (Windows & Balconies)**: Displayed as compact pills on the right side inside the dial. Icons automatically switch to open state with an animated pulsing alert (`#ef4444`) when open. Clicking opens the entity more-info dialog.
- **Zone Valve Percentage**: Positioned in the lower-right corner of the dial with an authentic valve icon (`mdi:valve`) and real-time open percentage (e.g. `0%` or `100%`).
- **Towel Heater (Bathroom)**: Positioned specularly in the lower-left corner with heating coil icon (`mdi:heating-coil`). Clicking toggles the heater on or off.
- **Ambient Humidity**: Neatly displayed under the temperature with a droplet icon (e.g. `💧 52%`).
- **Universal Step & Reset Events (`event_up`, `event_down`, `event_reset`)**: Easily trigger any `script.*`, `button.*`, `switch.*`, or `input_button.*` when pressing `+`, `−`, or the header Reset `↻` button.
- **Direct KNX 1-Bit Step Support**: Direct telegram control (`knx_step_address`) for KNX thermostats without needing custom scripts.
- **Official Home Assistant Dashboard Features**: Full compatibility with the official [Home Assistant Dashboard Features](https://www.home-assistant.io/dashboards/features) specification (`climate-preset-modes` and `climate-hvac-modes`).
- **Visual UI Editor**: Fully configurable via the Home Assistant card editor UI (`ha-form`) or raw YAML.

---

## 📦 Installation

### Method 1: HACS (Recommended)

1. Ensure [HACS](https://hacs.xyz/) is installed in your Home Assistant instance.
2. In Home Assistant, open **HACS** > **Frontend**.
3. Click the three dots icon in the top right corner and select **Custom repositories**.
4. Enter:
   - **Repository**: `https://github.com/evlas/climate-card`
   - **Type**: `Dashboard` (or `Lovelace`)
5. Click **Add**, locate **Climate Card**, and click **Download**.
6. Refresh your browser cache.

### Method 2: Manual Installation

1. Download [`climate-card.js`](https://raw.githubusercontent.com/evlas/climate-card/main/climate-card.js) from the latest release.
2. Copy `climate-card.js` into your Home Assistant `<config>/www/` directory:
   ```bash
   /config/www/climate-card.js
   ```
3. In Home Assistant, navigate to **Settings** > **Dashboards** > **Resources** (via top-right menu).
4. Click **Add Resource**:
   - **URL**: `/local/climate-card.js`
   - **Resource type**: `JavaScript Module`
5. Refresh your browser cache (`Ctrl + F5`).

---

## ⚙️ Configuration

You can add this card through the visual card picker by clicking **Add Card** and selecting **Climate Card**, or by configuring it in YAML.

### Configuration Variables

| Variable | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | - | `custom:climate-card` (custom alternative to standard `thermostat`). |
| `entity` | `string` | **Yes** | - | Entity ID from the `climate` domain (e.g. `climate.living_room`). |
| `name` | `string` | No | `friendly_name` | Custom title for the card header. |
| `theme` | `string` | No | - | Override the theme for this card. |
| `show_current_as_primary` | `boolean` | No | `true` | Show current room temperature as large primary text and target setpoint as secondary text below. |
| `features` | `list` | No | - | List of widgets compliant with [Home Assistant Dashboard Features](https://www.home-assistant.io/dashboards/features). |
| `step` | `number` | No | `0.5` | Target temperature step increment/decrement for `+` and `−` buttons. |
| `min_temp` | `number` | No | `16` | Minimum dial temperature (defaults to entity `min_temp`). |
| `max_temp` | `number` | No | `30` | Maximum dial temperature (defaults to entity `max_temp`). |
| `disable_slider` | `boolean` | No | `false` | Disables continuous touch dragging on the circular slider (forces step buttons). |

#### Custom Actions & Hardware Events (`+`, `−`, `↻`)

The stepper buttons (`+`, `−`) and the Reset button (`↻`, permanently located in the upper-right header next to the more-info icon) can execute any entity:

| Variable | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `event_up` | `string` | No | Entity called when `+` is clicked (`script.*`, `button.*`, `switch.*`, etc.). |
| `event_down` | `string` | No | Entity called when `−` is clicked (`script.*`, `button.*`, `switch.*`, etc.). |
| `event_reset` | `string` | No | Entity called when Reset `↻` is clicked (`script.*`, `button.*`, `switch.*`, etc.). |
| `knx_step_address` | `string` | No | KNX 1-bit group address (e.g. `"2/2/2"`). Sends `1` for up and `0` for down. |

#### Integrated Room Sensors & Fixtures

| Variable | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `valve_entity` | `string` | No | Zone valve entity (`sensor.*`, `number.*`, `valve.*`). Displayed in the bottom-right corner with valve icon (`mdi:valve`). |
| `towel_heater` | `string` | No | Bathroom towel heater / radiator (`switch.*`, `climate.*`, `input_boolean.*`). Positioned in the bottom-left corner with heating coil icon (`mdi:heating-coil`). Click to toggle. |
| `windows` | `string` / `list` | No | Window sensor (`binary_sensor.*`) or list of window sensors. |
| `balconies` | `string` / `list` | No | Balcony / patio door sensor (`binary_sensor.*`) or list of sensors. |
| `humidity_entity` | `string` | No | Room humidity sensor (`sensor.*`). If omitted, reads entity attribute `current_humidity`. |

---

## 🎛️ Dashboard Features (Official Home Assistant Specification)

The card fully supports the official [Home Assistant Dashboard Features](https://www.home-assistant.io/dashboards/features) syntax.

### 1. `climate-preset-modes`
Displays buttons to quickly switch between operating presets:

```yaml
features:
  - type: climate-preset-modes
    style: icons                         # "icons" (default) or "dropdown"
    preset_modes:
      - comfort                          # Couch icon (mdi:sofa)
      - standby                          # Clock icon (mdi:clock-outline)
      - economy                          # Leaf icon (mdi:leaf)
      - building_protection              # Shield icon (mdi:shield-home)
```

- **Smart Icon Mapping**: Automatically maps standard Home Assistant presets (`home`, `away`, `eco`, `comfort`, `sleep`, `activity`, `boost`) and KNX presets (`comfort`, `standby`, `economy`, `building_protection`, `frost_protection`).
- **Exact Order**: Displays only the modes specified, in the exact order requested.

### 2. `climate-hvac-modes`
Adds a segmented bar for HVAC operation modes:

```yaml
features:
  - type: climate-hvac-modes
    style: icons
    hvac_modes:
      - heat                             # Fire icon
      - cool                             # Snowflake icon
      - auto                             # Autorenew icon
      - off                              # Power icon
```

### 3. Card-Specific Widgets in `features` (Optional)
If you prefer a purely modular `features` block, you can also define accessories inside `features`:

```yaml
features:
  - type: climate-preset-modes
    style: icons
    preset_modes: [comfort, standby, economy, building_protection]
  - type: climate-card-valve
    entity: sensor.living_room_valve
  - type: climate-card-towel-heater
    entity: switch.bathroom_towel_heater
  - type: climate-card-fixtures
    windows: binary_sensor.living_room_window
    balconies: binary_sensor.living_room_balcony
```

---

## 📋 YAML Examples

### 1. Living Room with Custom Scripts / Buttons
```yaml
type: custom:climate-card
entity: climate.living_room
name: Living Room
event_up: script.target_living_room_up       # or button.living_room_up
event_down: script.target_living_room_down   # or button.living_room_down
event_reset: script.reset_living_room        # triggered by ↻ in top-right header
valve_entity: sensor.living_room_valve
windows: binary_sensor.living_room_window
balconies: binary_sensor.living_room_balcony
humidity_entity: sensor.living_room_humidity
features:
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```

### 2. Bathroom with Towel Heater and Zone Valve
```yaml
type: custom:climate-card
entity: climate.master_bathroom
name: Master Bathroom
towel_heater: switch.bathroom_towel_heater  # on/off toggle button in bottom-left
valve_entity: sensor.bathroom_valve         # percentage badge in bottom-right
windows: binary_sensor.bathroom_window
features:
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```

### 3. Direct KNX 1-Bit Step Control
```yaml
type: custom:climate-card
entity: climate.living_room
name: Living Room
knx_step_address: "2/2/2"                   # sends 1 on up (+), 0 on down (−)
event_reset: script.reset_living_room
valve_entity: sensor.living_room_valve
features:
  - type: climate-preset-modes
    style: icons
    preset_modes:
      - comfort
      - standby
      - economy
      - building_protection
```

### 4. Combined Preset Modes and HVAC Modes
```yaml
type: custom:climate-card
entity: climate.bedroom
name: Bedroom
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

---

## 🇮🇹 Documentazione in Italiano

La documentazione completa in lingua italiana è disponibile in [README.it.md](README.it.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
