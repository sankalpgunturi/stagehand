import { LogLine } from "../../types/log";
import { ActionRecorder } from "../cache/ActionRecorder";
import { LLMProvider } from "../llm/LLMProvider";
export declare class TestCodeGenerator {
    private readonly actionRecorder;
    private readonly logger;
    private readonly llmProvider;
    constructor({ actionRecorder, logger, llmProvider, }: {
        actionRecorder?: ActionRecorder;
        logger: (logLine: LogLine) => void;
        llmProvider: LLMProvider;
    });
    private _getUrlFromActions;
    private _getRecordedActions;
    private _convertXPathToPlaywrightSelector;
    private _buildPythonPlaywrightCode;
    private _buildTypescriptPlaywrightCode;
    generateCode(language: string, testFramework: string): Promise<string>;
}
