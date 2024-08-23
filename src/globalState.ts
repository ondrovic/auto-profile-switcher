/**
 * Adapted from https://dev.to/robole/vs-code-profiles-know-what-profile-you-are-using-no-bloody-mystery-26ii
 * Credit https://github.com/robole/vscode-profile-status
 * Author Rob O'Leary
 */
import { promises as fs } from "fs";

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

/**
 *  Profiles are identified by an internal ID e.g 6c702312. We retrieve the name of the profile through this ID.
 */
// function getName(obj: UserData, id: string): string {
//   let profileName = "Default";

//   if (obj.userDataProfiles) {
//     const profileFound = obj.userDataProfiles.find((item) => item.location === id);

//     if (profileFound) {
//       profileName = profileFound.name;
//     }
//   }

//   return profileName;
// }

const getProfileList = (obj: UserData): UserDataProfile[] | undefined => {
  // let profile: UserDataProfile[] | undefined
  
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

  async function getProfileItems(workspaceUri: string): Promise<UserDataProfile[] | undefined> {
    let profiles: UserDataProfile[] | undefined;

    if (isEmpty(obj)) {
      await parseFile();
    }

    if (obj.profileAssociations && obj.profileAssociations.workspaces) {
      // association is in form of: { workspace_uri : profile_id }
      const workspaceAssociations = obj.profileAssociations.workspaces;

      
      Object.keys(workspaceAssociations).every((key) => {
        // const workspaceUriString = workspaceUri.toString();

        
        return true;
      });

      profiles = getProfileList(obj);
    }

    return profiles;
  }

  /**
   * Get the name of the profile associated with a workspace.
   */
  // async function getProfileName(workspaceUri: string): Promise<string | undefined> {
  //   let name: string | undefined;

  //   if (isEmpty(obj)) {
  //     await parseFile();
  //   }

  //   if (obj.profileAssociations && obj.profileAssociations.workspaces) {
  //     // association is in form of: { workspace_uri : profile_id }
  //     const workspaceAssociations = obj.profileAssociations.workspaces;

  //     let profileID: string | undefined;

  //     Object.keys(workspaceAssociations).every((key) => {
  //       const workspaceUriString = workspaceUri.toString();

  //       if (workspaceUriString === key) {
  //         profileID = workspaceAssociations[key];
  //         return false;
  //       }

  //       return true;
  //     });

  //     name = getName(obj, profileID!);
  //   }

  //   return name;
  // }

  return {
    // getProfileName,
    getProfileItems,
  };
}

export default globalState;

