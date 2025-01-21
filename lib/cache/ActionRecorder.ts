import { LogLine } from "../../types/log";
import { BaseCache, CacheEntry } from "./BaseCache";

export interface PlaywrightCommand {
  method: string;
  args: string[];
}

export interface ActionRecorderEntry extends CacheEntry {
  data: {
    url: string;
    playwrightCommand: PlaywrightCommand;
    componentString: string;
    xpaths: string[];
    newStepString: string;
    completed: boolean;
    previousSelectors: string[];
    action: string;
  };
}

/**
 * ActionRecorder handles logging and retrieving actions along with their Playwright commands for test framework code generation purposes.
 */
export class ActionRecorder extends BaseCache<ActionRecorderEntry> {
  constructor(
    logger: (message: LogLine) => void,
    cacheDir?: string,
    cacheFile?: string,
  ) {
    logger({
      category: "action_recorder",
      message:
        "initializing action recorder at " +
        cacheDir +
        " with file " +
        cacheFile,
      level: 1,
    });
    super(logger, cacheDir, cacheFile || "action_recorder.json");
    this.resetCache();
  }

  public async addActionStep({
    url,
    action,
    previousSelectors,
    playwrightCommand,
    componentString,
    xpaths,
    newStepString,
    completed,
    requestId,
  }: {
    url: string;
    action: string;
    previousSelectors: string[];
    playwrightCommand: PlaywrightCommand;
    componentString: string;
    requestId: string;
    xpaths: string[];
    newStepString: string;
    completed: boolean;
  }): Promise<void> {
    this.logger({
      category: "action_recorder",
      message: "adding action step to recorder",
      level: 1,
      auxiliary: {
        action: {
          value: action,
          type: "string",
        },
        requestId: {
          value: requestId,
          type: "string",
        },
        url: {
          value: url,
          type: "string",
        },
        previousSelectors: {
          value: JSON.stringify(previousSelectors),
          type: "object",
        },
        playwrightCommand: {
          value: JSON.stringify(playwrightCommand),
          type: "object",
        },
      },
    });

    await this.set(
      { url, action, previousSelectors },
      {
        url,
        playwrightCommand,
        componentString,
        xpaths,
        newStepString,
        completed,
        previousSelectors,
        action,
      },
      requestId,
    );
  }

  /**
   * Retrieves all actions for a specific trajectory.
   * @param trajectoryId - Unique identifier for the trajectory.
   * @param requestId - The identifier for the current request.
   * @returns An array of TrajectoryEntry objects or null if not found.
   */
  public async getActionStep({
    url,
    action,
    previousSelectors,
    requestId,
  }: {
    url: string;
    action: string;
    previousSelectors: string[];
    requestId: string;
  }): Promise<ActionRecorderEntry["data"] | null> {
    const data = await super.get({ url, action, previousSelectors }, requestId);
    if (!data) {
      return null;
    }

    return data;
  }

  public async removeActionStep(cacheHashObj: {
    url: string;
    action: string;
    previousSelectors: string[];
    requestId: string;
  }): Promise<void> {
    await super.delete(cacheHashObj);
  }

  /**
   * Clears all actions for a specific trajectory.
   * @param trajectoryId - Unique identifier for the trajectory.
   * @param requestId - The identifier for the current request.
   */
  public async clearAction(requestId: string): Promise<void> {
    await super.deleteCacheForRequestId(requestId);
    this.logger({
      category: "action_recorder",
      message: "cleared action for ID",
      level: 1,
      auxiliary: {
        requestId: {
          value: requestId,
          type: "string",
        },
      },
    });
  }

  /**
   * Gets all recorded actions sorted by timestamp.
   * @returns An array of all recorded actions with their data.
   */
  public async getAllActions(): Promise<ActionRecorderEntry[]> {
    if (!(await this.acquireLock())) {
      this.logger({
        category: "action_recorder",
        message: "Failed to acquire lock for getting all actions",
        level: 2,
      });
      return [];
    }

    try {
      const cache = this.readCache();
      const entries = Object.values(cache) as ActionRecorderEntry[];
      return entries.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      this.logger({
        category: "action_recorder",
        message: "Error getting all actions",
        level: 2,
        auxiliary: {
          error: {
            value: error.message,
            type: "string",
          },
          trace: {
            value: error.stack,
            type: "string",
          },
        },
      });
      return [];
    } finally {
      this.releaseLock();
    }
  }

  /**
   * Resets the entire action cache.
   */
  public async resetCache(): Promise<void> {
    await super.resetCache();
    this.logger({
      category: "action_recorder",
      message: "Action recorder has been reset.",
      level: 1,
    });
  }
}
