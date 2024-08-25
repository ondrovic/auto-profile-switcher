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

// interface UserDataProfile {
//     location: string;
//     name: string;
// }

let extensionContext: vscode.ExtensionContext;
let activeExtension: string;
let isProcessing: boolean = false; // Flag to prevent double firing


const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const handleDocumentChange = async (editor: vscode.TextEditor | undefined): Promise<void> => {
    if (isProcessing || !isSwitchingEnabled) { return; }
    isProcessing = true;

    console.log(`${messagePrefix} active window changed!`);
    activeExtension = await getActiveFileExtension(editor);
    const profile = await matchExtensionToProfile();

    // TODO: Switch to the profile
    await updateUser(`${messagePrefix} Switching to profile: ${profile}`);

    isProcessing = false;
};

const matchExtensionToProfile = async (): Promise<string> => {
    const activeExt = activeExtension.toLowerCase();
    const extensions = await getConfiguredExtensions();

    for (const entry of extensions) {
        if (entry.extensions.includes(activeExt)) {
            return entry.profile;
        }
    }
    return 'Default';
};

const getActiveFileExtension = async (editor: vscode.TextEditor | undefined): Promise<string> => {
    const fileName = editor?.document.fileName;
    return fileName?.split('.').pop() || 'no extension';
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
    extensionContext = context;

    await ensureSettings();
    updateSettingsFromConfig();
    registerCommands(context);

    extensionContext.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(handleConfigurationChange)
    );

    extensionContext.subscriptions.push(
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

            console.log(profiles);
        } catch (e) {
            console.error(e);
        }
    }
};

export const deactivate = async (): Promise<void> => {
    console.log(`${messagePrefix} is now deactivated!`);
    await setSwitchingIsEnabled(false);
};
