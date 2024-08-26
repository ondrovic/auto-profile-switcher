import * as vscode from 'vscode';
import {
    CFG_CONSOLE_MESSAGE_STATE,
    CFG_EXTENSIONS,
    CFG_ROOT,
    CFG_SWITCHING_STATE,
    CFG_UI_MESSSAGE_STATE
} from './constants';
import { consoleOutput } from './ui';

export let switchingState: boolean;
export let uiMessagesState: boolean;
export let consoleMessageState: boolean;

let config: vscode.WorkspaceConfiguration;

// Function to get configured extensions
export const getConfiguredExtensions = async (): Promise<{ profile: string; extensions: string[] }[]> => {
    return config.get(CFG_EXTENSIONS) || [];
};

// Function to ensure that settings are present with default values
export const ensureSettings = async (): Promise<void> => {
    if (config.get(CFG_SWITCHING_STATE) === undefined) {
        await config.update(CFG_SWITCHING_STATE, true, vscode.ConfigurationTarget.Global);
    }
    if (config.get(CFG_UI_MESSSAGE_STATE) === undefined) {
        await config.update(CFG_UI_MESSSAGE_STATE, true, vscode.ConfigurationTarget.Global);
    }
    if (config.get(CFG_CONSOLE_MESSAGE_STATE) === undefined) {
        await config.update(CFG_CONSOLE_MESSAGE_STATE, true, vscode.ConfigurationTarget.Global);
    }
};

// Function to update settings from the configuration
export const updateSettingsFromConfig = () => {
    config = vscode.workspace.getConfiguration(CFG_ROOT);
    switchingState = config.get<boolean>(CFG_SWITCHING_STATE, true);
    uiMessagesState = config.get<boolean>(CFG_UI_MESSSAGE_STATE, true);
    consoleMessageState = config.get<boolean>(CFG_CONSOLE_MESSAGE_STATE, true);
};

// Function to set the switching enable setting
export const setSwitchingState = async (state: boolean): Promise<void> => {
    await config.update(CFG_SWITCHING_STATE, state, vscode.ConfigurationTarget.Global);
    updateSettingsFromConfig();
    consoleOutput(`Switching is now ${state ? 'enabled' : 'disabled'}!`);
};

// Function to set the display user messages setting
export const setDisplayUIMessages = async (state: boolean): Promise<void> => {
    await config.update(CFG_UI_MESSSAGE_STATE, state, vscode.ConfigurationTarget.Global);
    updateSettingsFromConfig();
    consoleOutput(`UI messages ${state ? 'enabled' : 'disabled'}!`);
};

// Function to set the console messages setting
export const setConsoleMessages = async (state: boolean): Promise<void> => {
    await config.update(CFG_CONSOLE_MESSAGE_STATE, state, vscode.ConfigurationTarget.Global);
    updateSettingsFromConfig();
    consoleOutput(`Console messages ${state ? 'enabled' : 'disabled'}!`);
};

export function activate(context: vscode.ExtensionContext) {
    // Initialize settings
    updateSettingsFromConfig();
    
    // Ensure settings are present
    ensureSettings();

    // Add a configuration change listener
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(CFG_ROOT)) {
                updateSettingsFromConfig();
            }
        })
    );
}