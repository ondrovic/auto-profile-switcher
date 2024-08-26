import * as vscode from 'vscode';
import { uiMessagesState, consoleMessageState } from './settings';
import { MESSAGE_PREFIX } from './constants';

export const showMessageWithProgress = async (message: string): Promise<void> => {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: message,
            cancellable: false,
        },
        async () => {
            return new Promise<void>(resolve => {
                setTimeout(() => resolve(), 1000);
            });
        }
    );
};

export const messageOutput = async (message: string): Promise<void> => {
    if (uiMessagesState) {
        await showMessageWithProgress(`${MESSAGE_PREFIX} ${message}`);
    }
};

export const consoleOutput = async (message: string): Promise<void> => {
    if (consoleMessageState) {
        console.log(`${MESSAGE_PREFIX} ${message}`);
    }
};