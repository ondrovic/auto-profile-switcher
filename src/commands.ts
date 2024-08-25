import * as vscode from 'vscode';
import { setSwitchingIsEnabled, setDisplayUIMessages } from './settings'; // Import from settings.ts

const messagePrefix = "Auto Profile Switcher -";

export const registerCommands = (context: vscode.ExtensionContext) => {
    const switchingEnableCommand = vscode.commands.registerCommand('autoProfileSwitcher.switching.enable', async () => {
        await setSwitchingIsEnabled(true);
        console.log(`${messagePrefix} switching enabled!`);
    });

    const switchingDisableCommand = vscode.commands.registerCommand('autoProfileSwitcher.switching.disable', async () => {
        await setSwitchingIsEnabled(false);
        console.log(`${messagePrefix} switching disabled!`);
    });

    const displayMessagesEnableCommand = vscode.commands.registerCommand("autoProfileSwitcher.ui.messages.enable", async () => {
        await setDisplayUIMessages(true);
        console.log(`${messagePrefix} display messages enabled!`);
    });

    const displayMessagesDisableCommand = vscode.commands.registerCommand("autoProfileSwitcher.ui.messages.disable", async () => {
        await setDisplayUIMessages(false);
        console.log(`${messagePrefix} display messages disabled!`);
    });

    const cmdConsoleMessagesEnableCommand = vscode.commands.registerCommand("autoProfileSwitcher.console.messages.enable", async () => {
        await setDisplayUIMessages(true);
        console.log(`${messagePrefix} display messages enabled!`);
    });

    const cmdConsoleMessagesDisableCommand = vscode.commands.registerCommand("autoProfileSwitcher.console.messages.disable", async () => {
        await setDisplayUIMessages(false);
        console.log(`${messagePrefix} display messages disabled!`);
    });

    context.subscriptions.push(
        switchingEnableCommand,
        switchingDisableCommand,
        displayMessagesEnableCommand,
        displayMessagesDisableCommand
    );
};
