import { Smartfile } from 'smartfile';
export interface ScafTemplateContructorOptions {
    name?: string;
    description?: string;
    sourceDir?: string;
}
export declare class ScafTemplate {
    name: string;
    description: string;
    templateObject: Smartfile[];
    requiredVariables: any[];
    constructor();
    /**
     * read a template from a directory
     */
    readTemplateFromDir(dirArg: string): Promise<void>;
    writeWithVariables(variablesArg: any): Promise<void>;
    /**
     * finds all variables in a Template
     */
    private _findVariablesInTemplate();
    /**
     * checks if supplied Variables satisfy the template
     */
    private _checkSuppliedVariables(variablesArg);
}
