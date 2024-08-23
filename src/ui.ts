import * as vscode from 'vscode';
import { displayUIMessages } from './settings';

export const messagePrefix = "Auto Profile Switcher -";

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

export const updateUser = async (status: string): Promise<void> => {
    if (displayUIMessages) {
        await showMessageWithProgress(status);
    }
};
