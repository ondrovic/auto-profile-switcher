import * as vscode from 'vscode';
import globalState from './globalState';
import Environment from './environment';
let isEnabled: boolean = true; // Default to enabled
let activeExtension: string = 'No extension';
let extensionContext: vscode.ExtensionContext;

const getConfiguredExtensions = async (): Promise<{ profile: string; extensions: string[] }[]> => {
    const config = vscode.workspace.getConfiguration('autoProfileSwitcher');
    return config.get('extensions') || [];
};


// TODO: Ability to see what extensions are mapped to what profiles in Setting UI (not settings.json) - should pull from the autoProfileSwitcher.extensions [] in settings.json
// TODO: Ability to add profiles and/or extensions to profiles  in Setting UI (not settings.json)  - should add to autoProfileSwitcher.extensions [] in settings.json
// TODO: Ability to remove profiles and/or extensions to profiles  in Setting UI (not settings.json)  - should remove from autoProfileSwitcher.extensions [] in settings.json
// TODO: convert rest of funcs to arrow
export const activate = async (context: vscode.ExtensionContext) => {
    
    console.log('Auto Profile Switcher is now active!');
    // getProfiles();
    extensionContext = context; // Store the context globally

    // Retrieve the stored state or default to enabled
    isEnabled = context.globalState.get('autoProfileSwitcher', true);

    let workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        let mainWorkspaceUri = workspaceFolders[0].uri;
        
        try {
            let env = new Environment(context);
            let globalStateUri = env.getGlobalStateUri();
      
            let state = globalState(globalStateUri);
            let profiles = await state?.getProfileItems(mainWorkspaceUri);
            
            console.log(profiles);
          } catch (err) {
            console.error(err);
          }
        
    }

    // Automatically enable the extension if it's not enabled
    if (!isEnabled) {
        setIsEnabled(true, "Auto Profile Switcher is Enabled");
    }

    // Register the enable command
    const enableCommand = vscode.commands.registerCommand('autoProfileSwitcher.enable', () => {
        setIsEnabled(true, "Auto Profile Switcher is Enabled");
    });

    // Register the disable command
    const disableCommand = vscode.commands.registerCommand('autoProfileSwitcher.disable', () => {
        setIsEnabled(false, "Auto Profile Switcher is Disabled");
    });

    context.subscriptions.push(enableCommand, disableCommand);

    // Monitor file changes
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            handleDocumentChange(vscode.window.activeTextEditor);
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            handleDocumentChange(editor);
        })
    );
};


const handleDocumentChange = async (editor: vscode.TextEditor | undefined): Promise<void> => {
    if (isEnabled) {
        console.log('File change detected');
        activeExtension = await getActiveFileExtension(editor);
        const profile = await matchExtensionToProfile(); // Get the profile based on the active extension
        // TODO: switch to the profile

        updateUser(`Auto Profile Switcher - Switching to profile: ${profile}`);
    }
};


const matchExtensionToProfile = async (): Promise<string> => {
    const activeExt = activeExtension.toLowerCase();
    const extensions = await getConfiguredExtensions();
    
    for (const entry of extensions) {
        if (entry.extensions.includes(activeExt)) {
            return entry.profile; // Return the matched language
        }
    }
    return "Default"; // Return a default profile if no match is found
};



const getActiveFileExtension = async (editor: vscode.TextEditor | undefined): Promise<string> => {
    const fileName = editor?.document.fileName;
    return fileName?.split('.').pop() || 'No extension';
};


const setIsEnabled = async (enabled: boolean, message: string): Promise<void> => {
    isEnabled = enabled;
    await showMessageWithProgress(message);
    await extensionContext.globalState.update('autoProfileSwitcher', isEnabled);
};


const showMessageWithProgress = async (message: string): Promise<void> => {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: message,
        cancellable: false
    }, async (progress, token) => {
        return new Promise<void>(resolve => {
            setTimeout(() => resolve(), 1000);
        });
    });
};


const updateUser = async (status: string): Promise<void> => {
    if (activeExtension !== 'No extension') {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: status,
            cancellable: false
        }, async (progress, token) => {
            return new Promise<void>(resolve => {
                setTimeout(() => resolve(), 1000);
            });
        });
    }
};

export async function deactivate(): Promise<void> {
    console.log('Auto Profile Switcher is now deactivated!');
    await setIsEnabled(false, "Auto Profile Switcher is Disabled");
}