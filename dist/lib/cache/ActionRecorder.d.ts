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
export declare class ActionRecorder extends BaseCache<ActionRecorderEntry> {
    constructor(logger: (message: LogLine) => void, cacheDir?: string, cacheFile?: string);
    addActionStep({ url, action, previousSelectors, playwrightCommand, componentString, xpaths, newStepString, completed, requestId, }: {
        url: string;
        action: string;
        previousSelectors: string[];
        playwrightCommand: PlaywrightCommand;
        componentString: string;
        requestId: string;
        xpaths: string[];
        newStepString: string;
        completed: boolean;
    }): Promise<void>;
    /**
     * Retrieves all actions for a specific trajectory.
     * @param trajectoryId - Unique identifier for the trajectory.
     * @param requestId - The identifier for the current request.
     * @returns An array of TrajectoryEntry objects or null if not found.
     */
    getActionStep({ url, action, previousSelectors, requestId, }: {
        url: string;
        action: string;
        previousSelectors: string[];
        requestId: string;
    }): Promise<ActionRecorderEntry["data"] | null>;
    removeActionStep(cacheHashObj: {
        url: string;
        action: string;
        previousSelectors: string[];
        requestId: string;
    }): Promise<void>;
    /**
     * Clears all actions for a specific trajectory.
     * @param trajectoryId - Unique identifier for the trajectory.
     * @param requestId - The identifier for the current request.
     */
    clearAction(requestId: string): Promise<void>;
    /**
     * Gets all recorded actions sorted by timestamp.
     * @returns An array of all recorded actions with their data.
     */
    getAllActions(): Promise<ActionRecorderEntry[]>;
    /**
     * Resets the entire action cache.
     */
    resetCache(): Promise<void>;
}
