import * as vscode from 'vscode';
import { CFG_CONSOLE_MESSAGE_STATE, CFG_EXTENSIONS, CFG_SWITCHING_STATE, CFG_ROOT, CFG_UI_MESSSAGE_STATE, MESSAGE_PREFIX } from './constants';
import { consoleOutput } from './ui';

// BUGFIX: these aren't persisting meaning no matter what you change the setting to they are always flase :*-(
export let switchingState: boolean;
export let uiMessagesState: boolean;
export let consoleMessageState: boolean;

const config = vscode.workspace.getConfiguration(CFG_ROOT);

// Function to get configured extensions
export const getConfiguredExtensions = async (): Promise<{ profile: string; extensions: string[] }[]> => {
    return config.get(CFG_EXTENSIONS) || [];
};

// Function to ensure that settings are present with default values
export const ensureSettings = async (): Promise<void> => {
    // Ensure 'switching.enable' setting is present and has a default value
    if (config.get(CFG_SWITCHING_STATE) === undefined) {
        await config.update(CFG_SWITCHING_STATE, true, vscode.ConfigurationTarget.Global);
    }

    // Ensure 'display.messages' setting is present and has a default value
    if (config.get(CFG_UI_MESSSAGE_STATE) === undefined) {
        await config.update(CFG_UI_MESSSAGE_STATE, true, vscode.ConfigurationTarget.Global);
    }
};

// Function to update settings from the configuration
export const updateSettingsFromConfig = () => {
    switchingState = config.get<boolean>(CFG_SWITCHING_STATE, true);
    uiMessagesState = config.get<boolean>(CFG_UI_MESSSAGE_STATE, true);
    consoleMessageState = config.get<boolean>(CFG_CONSOLE_MESSAGE_STATE, true);
};

// Function to set the switching enable setting
export const setSwitchingState = async (state: boolean): Promise<void> => {
    await config.update(CFG_SWITCHING_STATE, state, vscode.ConfigurationTarget.Global);
    updateSettingsFromConfig(); // Immediately update settings after changing
    consoleOutput(`Switching is now ${state ? 'enabled' : 'disabled'}!`);
};

// Function to set the display user messages setting
export const setDisplayUIMessages = async (state: boolean): Promise<void> => {
    await config.update(CFG_UI_MESSSAGE_STATE, state, vscode.ConfigurationTarget.Global);
    consoleOutput(`UI messages ${state ? 'enabled' : 'disabled'}!`);
};

// Func to set tehe console messages setting
export const setConsoleMessages = async (state: boolean): Promise<void> => {
    await config.update(CFG_CONSOLE_MESSAGE_STATE, state, vscode.ConfigurationTarget.Global);
    consoleOutput(`Console messages ${state ? 'enabled' : 'disabled'}!`);
};