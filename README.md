![License](https://img.shields.io/badge/license-MIT-blue)

# Automatic Profile Switcher Extension

The Automatic Profile Switcher extension, aims to automatically switch profiles based on your defined extensions. I was tired of my multi technology repos having the wrong set of extensions and I found my self wasting about 1-2 secs everytime I changed items.

## Settings

### `auto.profile.switcher.switching.enabled`

- **Description:** Enables or disables the automatic profile switching feature.
- **Type:** Boolean
- **Default:** true
- **Usage:** When set to `true`, the extension automatically switches profiles based on the file extension or project type. Set to `false` to disable this functionality.

### `auto.profile.switcher.extensions`

- **Description:** Controls whether informational messages are displayed when profiles are switched.
- **Type:** Boolean
- **Default:** true
- **Usage:** Set to `true` to display messages when a profile switch occurs. If set to `false`, no messages will be shown.

### `auto.profile.switcher.extensions`

- **Description:** Defines the mapping between file extensions and their respective profiles. This allows customization of which profile is activated when certain file types are opened.
- **Type:** Array of objects
- **Default:** []
- **Structure:** Each object in the array represents a profile and its associated file extensions. The object has the following properties:
  - `profile`: (String) The name of the profile.
  - `extensions`: (Array of Strings) List of file extensions associated with the profile.
- **Usage:** Add objects to the array to map specific profiles to their corresponding file extensions. For example, you can add an object to map the `"JavaScriptProfile"` to `[".js", ".jsx"]` extensions.

Example Settings ( `settings.json` ):

```json
  "auto.profile.switcher.console.messages": false,
  "auto.profile.switcher.ui.messages": true,
  "auto.profile.switcher.switching.enabled": true,
  "auto.profile.switcher.extensions": [
    {
      "profile": "GO",
      "extensions": [
        ".go",
        ".sum",
        ".mod"
      ]
    },
    {
      "profile": "Python",
      "extensions": [
        ".py"
      ]
    }
  ],
```

Settings ( `Setting UI` )

![Settings UI](assets/settings_ui.png)

## Commands

### `auto.profile.switcher.switching.enable`

- **Description:** Command to enable the automatic profile switching feature.
- **Usage:** Run this command to turn on automatic profile switching if it is currently disabled.

### `auto.profile.switcher.switching.disable`

- **Description:** Command to disable the automatic profile switching feature.
- **Usage:** Run this command to turn off automatic profile switching if it is currently enabled.

### `auto.profile.switcher.display.messages.enable`

- **Description:** Command to enable the display of informational messages during profile switches.
- **Usage:** Use this command to show messages whenever a profile switch occurs.

### `auto.profile.switcher.display.messages.disable`

- **Description:** Command to disable the display of informational messages during profile switches.
- **Usage:** Use this command to suppress messages during profile switches.

![User Message](assets/user_message.png)

### Example Commands Interface

Below is a screenshot showing how to access these commands in VS Code. To access the commands, press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS) to open the Command Palette and type the command name `Automatic Profile Switcher`.

![Command Palette](assets/command_palette.png)

## TODO

For more information on tasks and future improvements, please see the [TODO file](TODO).
