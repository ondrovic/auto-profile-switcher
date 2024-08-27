import * as vscode from 'vscode';
import { registerCommands } from './commands';
import {
    CFG_CONSOLE_MESSAGES_PATH,
    CFG_EXTENSIONS_PATH,
    CFG_SWITCHING_PATH,
    CFG_UI_MESSAGES_PATH
} from './constants';
import {
    activate as activateSettings,
    ensureSettings,
    setSwitchingState,
    switchingState,
    updateSettingsFromConfig,
} from './settings';
import {
    consoleOutput,
    messageOutput
} from './ui';
import {
    debounce,
    getActiveFileExtension,
    matchExtensionToProfile,
    setActiveExtension
} from './utils';

let isProcessing: boolean = false;

const handleDocumentChange = async (editor?: vscode.TextEditor): Promise<void> => {
    if (isProcessing || !switchingState || !editor) { return; }

    try {
        isProcessing = true;

        const activeExtension = await getActiveFileExtension(editor);
        setActiveExtension(activeExtension);

        const profile = await matchExtensionToProfile();

        if (profile) {
            await messageOutput(`Switching to profile: ${profile}`);
            consoleOutput(`Switching to profile: ${profile}: ${activeExtension}`);
        } else {
            consoleOutput(`No matching profile found for: ${activeExtension}`);
        }
    } finally {
        isProcessing = false;
    }
};

const handleConfigurationChange = debounce((event: vscode.ConfigurationChangeEvent) => {
    const updatedSettings: string[] = [];

    if (event.affectsConfiguration(CFG_SWITCHING_PATH)) {
        updatedSettings.push('Switching');
    }
    if (event.affectsConfiguration(CFG_UI_MESSAGES_PATH)) {
        updatedSettings.push('UI Messages');
    }
    if (event.affectsConfiguration(CFG_CONSOLE_MESSAGES_PATH)) {
        updatedSettings.push('Console Messages');
    }
    if (event.affectsConfiguration(CFG_EXTENSIONS_PATH)) {
        updatedSettings.push('Extensions');
    }

    if (updatedSettings.length > 0) {
        updateSettingsFromConfig();
        const settingsString = updatedSettings.join(', ');
        consoleOutput(`Settings updated: ${settingsString}`);
    }
}, 500);

export const activate = async (context: vscode.ExtensionContext) => {
    consoleOutput('Extension is now active!');

    // Activate settings
    activateSettings(context);

    await ensureSettings();
    updateSettingsFromConfig();
    registerCommands(context);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(handleConfigurationChange)
    );

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(_ => {
            handleDocumentChange(vscode.window.activeTextEditor);
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            handleDocumentChange(editor);
        })
    );
};

export const deactivate = async (): Promise<void> => {
    consoleOutput('Extension is now deactivated!');
    await setSwitchingState(false);
};