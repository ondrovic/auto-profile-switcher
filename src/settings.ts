import * as vscode from 'vscode';

export let isSwitchingEnabled: boolean; // Will be set from config
export let displayUIMessages: boolean; // Will be set from config

// Function to get configured extensions
export const getConfiguredExtensions = async (): Promise<{ profile: string; extensions: string[] }[]> => {
    const config = vscode.workspace.getConfiguration('autoProfileSwitcher');
    return config.get('extensions') || [];
};

// Function to ensure that settings are present with default values
export const ensureSettings = async (): Promise<void> => {
    const config = vscode.workspace.getConfiguration('autoProfileSwitcher');

    // Ensure 'switching.enable' setting is present and has a default value
    if (config.get('switching.enabled') === undefined) {
        await config.update('switching.enable', true, vscode.ConfigurationTarget.Global);
    }

    // Ensure 'display.messages' setting is present and has a default value
    if (config.get('display.messages') === undefined) {
        await config.update('display.messages', true, vscode.ConfigurationTarget.Global);
    }
};

// Function to update settings from the configuration
export const updateSettingsFromConfig = () => {
    const config = vscode.workspace.getConfiguration('autoProfileSwitcher');
    isSwitchingEnabled = config.get<boolean>('switching.enabled', true);
    displayUIMessages = config.get<boolean>('display.messages', true);
};

// Function to set the switching enable setting
export const setSwitchingIsEnabled = async (enabled: boolean): Promise<void> => {
    const config = vscode.workspace.getConfiguration('autoProfileSwitcher');
    await config.update('switching.enabled', enabled, vscode.ConfigurationTarget.Global);
    updateSettingsFromConfig(); // Immediately update settings after changing
};

// Function to set the display user messages setting
export const setDisplayUIMessages = async (display: boolean): Promise<void> => {
    const config = vscode.workspace.getConfiguration('autoProfileSwitcher');
    await config.update('display.messages', display, vscode.ConfigurationTarget.Global);
};
