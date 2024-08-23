/**
 * Adapted from https://dev.to/robole/vs-code-profiles-know-what-profile-you-are-using-no-bloody-mystery-26ii
 * Credit https://github.com/robole/vscode-profile-status
 * Author Rob O'Leary
 */
import * as vscode from "vscode";
import * as path from "path";

/**
 * App information about local system.
 */
class Environment {
  private globalStateUri: string;

  constructor(context: vscode.ExtensionContext) {
    this.globalStateUri = resolveGlobalStateUri(context);
  }

  /**
   * Get the URI of the storage.json file that represents the global workspace state.
   */
  public getGlobalStateUri(): vscode.Uri {
    return vscode.Uri.file(this.globalStateUri);
  }
}

export default Environment;

/**
 * Resolve the filepath for storage.json file.
 */
function resolveGlobalStateUri(context: vscode.ExtensionContext): string {
  const portableAppPath = process.env.VSCODE_PORTABLE;
  let filepath: string;

  if (portableAppPath === undefined) {
    filepath = path.join(
      context.globalStoragePath,
      "../../..",
      "User",
      "globalStorage",
      "storage.json"
    );
  } else {
    filepath = path.join(
      portableAppPath,
      "user-data",
      "User",
      "globalStorage",
      "storage.json"
    );
  }

  return filepath;
}

