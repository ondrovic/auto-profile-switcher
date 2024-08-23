/**
 * Adapted from https://dev.to/robole/vs-code-profiles-know-what-profile-you-are-using-no-bloody-mystery-26ii
 * Credit https://github.com/robole/vscode-profile-status
 * Author Rob O'Leary
 */
import { promises as fs } from "fs";
import { Uri } from "vscode";

interface UserDataProfile {
  location: string;
  name: string;
}

interface ProfileAssociations {
  workspaces: Record<string, string>;
}

interface UserData {
  userDataProfiles?: UserDataProfile[];
  profileAssociations?: ProfileAssociations;
}


const getProfileList = (obj: UserData): UserDataProfile[] | undefined => {
  return obj.userDataProfiles;
};

/*
 * Is it an empty object?
 */
function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/*
 * Closure for Global State
 */
function globalState(uri: { fsPath: string }) {
  let obj: UserData = {};

  async function parseFile(): Promise<void> {
    try {
      const data = await fs.readFile(uri.fsPath, "utf-8");
      obj = JSON.parse(data);
    } catch (err) {
      console.error(`Cannot read ${uri.fsPath} to instantiate GlobalState. Err: ${err}`);
    }
  }

  async function getProfileItems(workspaceUri: Uri): Promise<UserDataProfile[] | undefined> {
    let profiles: UserDataProfile[] | undefined;

    if (isEmpty(obj)) {
      await parseFile();
    }

    if (obj.profileAssociations && obj.profileAssociations.workspaces) {
      // association is in form of: { workspace_uri : profile_id }
      const workspaceAssociations = obj.profileAssociations.workspaces;

      
      Object.keys(workspaceAssociations).every((_) => {
        
        return true;
      });

      profiles = getProfileList(obj);
    }

    return profiles;
  }

  return {
    getProfileItems,
  };
}

export default globalState;

