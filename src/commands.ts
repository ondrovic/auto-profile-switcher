import * as vscode from 'vscode';
import {
    CMD_CONSOLE_MESSAGES_DISABLE, CMD_CONSOLE_MESSAGES_ENABLE,
    CMD_SWITCHING_DISABLE, CMD_SWITCHING_ENABLE,
    CMD_UI_MESSAGES_DISABLE, CMD_UI_MESSAGES_ENABLE
} from './constants';
import { setConsoleMessages, setDisplayUIMessages, setSwitchingState } from './settings';

export const registerCommands = (context: vscode.ExtensionContext) => {
    const cmdEnableSwitching = vscode.commands.registerCommand(CMD_SWITCHING_ENABLE, async () => {
        await setSwitchingState(true);
    });

    const cmdDisableSwitching = vscode.commands.registerCommand(CMD_SWITCHING_DISABLE, async () => {
        await setSwitchingState(false);
    });

    const cmdEnableUIMessages = vscode.commands.registerCommand(CMD_UI_MESSAGES_ENABLE, async () => {
        await setDisplayUIMessages(true);
    });

    const cmdDisableUIMessages = vscode.commands.registerCommand(CMD_UI_MESSAGES_DISABLE, async () => {
        await setDisplayUIMessages(false);
    });

    const cmdEnableConsoleMessages = vscode.commands.registerCommand(CMD_CONSOLE_MESSAGES_ENABLE, async () => {
        await setConsoleMessages(true);
    });

    const cmdDisableConsoleMessages = vscode.commands.registerCommand(CMD_CONSOLE_MESSAGES_DISABLE, async () => {
        await setConsoleMessages(false);
    });

    context.subscriptions.push(
        cmdEnableSwitching,
        cmdDisableSwitching,
        cmdEnableUIMessages,
        cmdDisableUIMessages,
        cmdEnableConsoleMessages,
        cmdDisableConsoleMessages
    );
};
