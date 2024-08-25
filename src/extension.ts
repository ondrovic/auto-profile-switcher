import globalState from './globalState';
import Environment from './environment';


import * as vscode from 'vscode';
import {
    getConfiguredExtensions,
    ensureSettings,
    updateSettingsFromConfig,
    isSwitchingEnabled,
    setSwitchingIsEnabled,
} from './settings'; // Import functions from settings.ts
import { registerCommands } from './commands'; // Import commands from commands.ts
import { updateUser, messagePrefix } from './ui'; // Import UI functions from ui.ts


let activeExtension: string;
let isProcessing: boolean = false; // Flag to prevent double firing

// TODO: move to utils.ts
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout | undefined;

    return (...args: Parameters<T>): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
};

const handleDocumentChange = async (editor?: vscode.TextEditor): Promise<void> => {
    if (isProcessing || !isSwitchingEnabled || !editor) { return ; }

    try {
        isProcessing = true;

        activeExtension = await getActiveFileExtension(editor);

        const profile = await matchExtensionToProfile();

        if (profile) {
            await updateUser(`${messagePrefix} Switching to profile: ${profile}`);
            console.log(`${messagePrefix} Switching to profile: ${profile}: ${activeExtension}`);
        } else {
            console.log(`${messagePrefix} No matching profile found for: ${activeExtension}`);
        }
    } finally {
        isProcessing = false;
    }
};

// TODO: move to utils.ts
const matchExtensionToProfile = async (): Promise<string> => {
    const extensions = await getConfiguredExtensions();

    return extensions.find(entry => entry.extensions.includes(`.${activeExtension}`))?.profile || 'Default';
};

// TODO: move to utils.ts
const getActiveFileExtension = async (editor?: vscode.TextEditor): Promise<string> => {
    const fileName = editor?.document.fileName;

    if (!fileName) { return 'no extension'; }

    // Split the filename by periods and get the last part
    const parts = fileName.split('.');
    // If there is more than one part, pop the last part; otherwise, default to 'no extension'
    const ext = parts.length > 1 ? parts.pop() : 'no extension';

    // Ensure `ext` is a string
    return ext || 'no extension';
};



const handleConfigurationChange = debounce((event: vscode.ConfigurationChangeEvent) => {
    if (event.affectsConfiguration('autoProfileSwitcher.switching.enabled') ||
        event.affectsConfiguration('autoProfileSwitcher.ui.messages')) {
        updateSettingsFromConfig();
        console.log(`${messagePrefix} settings updated!`);
    }
}, 500);

export const activate = async (context: vscode.ExtensionContext) => {
    console.log(`${messagePrefix} is now active!`);

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

    // TODO: move to own file
    // grab profiles
    let workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        let mainWorkspaceUri = workspaceFolders[0].uri;

        try {
            let env = new Environment(context);
            let globalStateUri = env.getGlobalStateUri();
            let state = globalState(globalStateUri);
            let profiles = await state?.getProfileItems(mainWorkspaceUri);

            // console.log(profiles);
        } catch (e) {
            console.error(e);
        }
    }
};

export const deactivate = async (): Promise<void> => {
    console.log(`${messagePrefix} is now deactivated!`);
    await setSwitchingIsEnabled(false);
};
