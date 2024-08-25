import * as vscode from 'vscode';
import { CONFIG_ROOT, EXTENSIONS } from './constants';

export let isSwitchingEnabled: boolean; // Will be set from config
export let displayUIMessages: boolean; // Will be set from config

const config = vscode.workspace.getConfiguration(CONFIG_ROOT);
// Function to get configured extensions
export const getConfiguredExtensions = async (): Promise<{ profile: string; extensions: string[] }[]> => {
    // const config = vscode.workspace.getConfiguration(CONFIG_ROOT);
    ;return config.get(EXTENSIONS) || [];
};

// Function to ensure that settings are present with default values
export const ensureSettings = async (): Promise<void> => {
    // const config = vscode.workspace.getConfiguration(CONFIG_ROOT);

    // Ensure 'switching.enable' setting is present and has a default value
    if (config.get('switching.enabled') === undefined) {
        await config.update('switching.enable', true, vscode.ConfigurationTarget.Global);
    }

    // Ensure 'display.messages' setting is present and has a default value
    if (config.get('ui.messages') === undefined) {
        await config.update('ui.messages', true, vscode.ConfigurationTarget.Global);
    }
};

// Function to update settings from the configuration
export const updateSettingsFromConfig = () => {
    // const config = vscode.workspace.getConfiguration(CONFIG_ROOT);
    isSwitchingEnabled = config.get<boolean>('switching.enabled', true);
    displayUIMessages = config.get<boolean>('ui.messages', true);
};

// Function to set the switching enable setting
export const setSwitchingIsEnabled = async (enabled: boolean): Promise<void> => {
    // const config = vscode.workspace.getConfiguration(CONFIG_ROOT);
    await config.update('switching.enabled', enabled, vscode.ConfigurationTarget.Global);
    updateSettingsFromConfig(); // Immediately update settings after changing
};

// Function to set the display user messages setting
export const setDisplayUIMessages = async (display: boolean): Promise<void> => {
    // const config = vscode.workspace.getConfiguration(CONFIG_ROOT);
    await config.update('ui.messages', display, vscode.ConfigurationTarget.Global);
};
