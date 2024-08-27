import { getConfiguredExtensions } from "./settings";
import * as vscode from 'vscode';

let activeExtension: string = '';

export const setActiveExtension = (extension: string) => {
    activeExtension = extension;
};

export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout | undefined;

    return (...args: Parameters<T>): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const getActiveFileExtension = async (editor?: vscode.TextEditor): Promise<string> => {
    const fileName = editor?.document.fileName;

    if (!fileName) { return 'no extension'; }

    const parts = fileName.split('.');
    const ext = parts.length > 1 ? parts.pop() : 'no extension';

    return ext || 'no extension';
};

export const matchExtensionToProfile = async (): Promise<string> => {
    const extensions = await getConfiguredExtensions();

    return extensions.find(entry => entry.extensions.includes(`.${activeExtension}`))?.profile || 'Default';
};