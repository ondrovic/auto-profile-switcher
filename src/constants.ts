export const MESSAGE_PREFIX = "Auto Profile Switcher -";

// !!!! IMPORTANT - these need to match what you have your package.json under contributes.configuration {}

// indidivual confige values
export const CFG_ROOT = 'auto.profile.switcher';
export const CFG_EXTENSIONS = 'extensions';
export const CFG_SWITCHING_STATE = 'switching.enabled';
export const CFG_UI_MESSSAGE_STATE = 'ui.messages';
export const CFG_CONSOLE_MESSAGE_STATE = "console.messages";

// combined config paths
export const CFG_SWITCHING_PATH = `${CFG_ROOT}.${CFG_SWITCHING_STATE}`;
export const CFG_UI_MESSAGES_PATH = `${CFG_ROOT}.${CFG_UI_MESSSAGE_STATE}`;
export const CFG_CONSOLE_MESSAGES_PATH = `${CFG_ROOT}.${CFG_CONSOLE_MESSAGE_STATE}`;
export const CFG_EXTENSIONS_PATH = `${CFG_ROOT}.${CFG_EXTENSIONS}`;

// combined commands
export const CMD_SWITCHING_ENABLE = `${CFG_ROOT}.switching.enable`;
export const CMD_SWITCHING_DISABLE = `${CFG_ROOT}.switching.disable`;
export const CMD_UI_MESSAGES_ENABLE = `${CFG_ROOT}.ui.messages.enable`;
export const CMD_UI_MESSAGES_DISABLE = `${CFG_ROOT}.ui.messages.disable`;
export const CMD_CONSOLE_MESSAGES_ENABLE = `${CFG_ROOT}.console.messages.enable`;
export const CMD_CONSOLE_MESSAGES_DISABLE = `${CFG_ROOT}.console.messages.disable`;
