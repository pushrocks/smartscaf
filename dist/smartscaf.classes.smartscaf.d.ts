import { Smartfile } from 'smartfile';
export interface ScafTemplateContructorOptions {
    name?: string;
    description?: string;
    sourceDir?: string;
}
export declare class ScafTemplate {
    name: string;
    description: string;
    templateSmartfileArray: Smartfile[];
    requiredVariables: string[];
    suppliedVariables: any;
    missingVariables: string[];
    /**
     * read a template from a directory
     */
    readTemplateFromDir(dirPathArg: string): Promise<void>;
    /**
     * supply the variables to render the teplate with
     * @param variablesArg
     */
    supplyVariables(variablesArg: any): Promise<void>;
    /**
     * finds all variables in a Template
     */
    private _findVariablesInTemplate();
    /**
     * checks if supplied Variables satisfy the template
     */
    private _checkSuppliedVariables(variablesArg);
}
