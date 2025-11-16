# TerrainVariableDisplay Plugin Guide

The `TerrainVariableDisplay` plugin replaces SRPG Studio's default terrain window with any variable from the project-wide **Variable Table**. This lets you use the HUD space to highlight objectives, timers, or other information instead of tile data.

## 1. Install and enable the plugin
1. Copy `Plugin/TerrainVariableDisplay.js` into your project's `Plugin` folder (it already lives there in this repo).
2. In SRPG Studio, open **Project -> Plugin** and enable `TerrainVariableDisplay`.

## 2. Configure the default variable
Open `TerrainVariableDisplay.js` in any text editor and edit the `TerrainVariableDisplaySettings` object near the top of the file:

| Setting | Purpose |
| ------- | ------- |
| `variablePageIndex` | The page in **Database -> Variable Table** that holds the variable you want to show. The first page is `0`, the second is `1`, etc. |
| `variableId` | The **ID** of the variable on that page. IDs are listed in the left column of the Variable Table. |
| `labelText` | Optional custom label. Leave empty (`''`) to reuse the variable's name from the database. |
| `prefixText` / `suffixText` | Text placed before/after the variable value (e.g. `Turn ` or `%`). |
| `showLabelLine` | When `true`, a separate label line is drawn above the value line. |
| `hideWindowIfUnavailable` | When `true`, the terrain window disappears if the configured variable cannot be found. Set `false` to always show the window (it will be blank if the variable is missing). |
| `mapCustomProperty` | Name of the per-map override slot. Leave as `terrainVariableDisplay` unless you already use that custom property for something else. |

Once these values are set, launch the game: the terrain box on the map scene should now display the chosen variable's value (and optional label/prefix/suffix).

## 3. Override the display on specific maps
You can have different maps show different variables without editing the plugin again. Each map in SRPG Studio can store a JSON-like object in **Custom Parameter**.

1. Open **Database -> Map List** and select the map you want to customize.
2. Click **Map Settings...**.
3. In the **Custom Parameter** field, add a property whose name matches `mapCustomProperty` (by default this is `terrainVariableDisplay`).

```json
{
    "terrainVariableDisplay": {
        "variablePageIndex": 1,
        "variableId": 7,
        "labelText": "Turns Left",
        "prefixText": "",
        "suffixText": "",
        "showLabelLine": true,
        "hideWindowIfUnavailable": true
    }
}
```

Any fields you omit fall back to the defaults from `TerrainVariableDisplaySettings`. For example, `{ "terrainVariableDisplay": { "variableId": 5 } }` only replaces the variable ID, leaving the other formatting untouched.

When the player loads that map, the plugin merges the map-specific object with the defaults and draws the resulting variable in the terrain window.

## 4. Troubleshooting tips
- If nothing appears, double-check the variable page and ID, and make sure `hideWindowIfUnavailable` is not hiding the window due to a typo.
- The variable window updates whenever the variable changes (e.g., through events or scripts). Confirm your events actually write to the variable you selected.
- Per-map overrides only work during a map; if you test from the title screen and jump straight into an event without a map, the terrain window will stay hidden.
