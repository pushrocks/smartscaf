import { Smartfile } from '@pushrocks/smartfile';
export interface ScafTemplateContructorOptions {
    name?: string;
    description?: string;
    sourceDir?: string;
}
export declare class ScafTemplate {
    static createTemplateFromDir(): Promise<void>;
    /**
     * the name of the template
     */
    name: string;
    /**
     * the descriptions of the template
     */
    description: string;
    /**
     * the location on disk of the template
     */
    dirPath: string;
    /**
     * the files of the template as array of Smartfiles
     */
    templateSmartfileArray: Smartfile[];
    requiredVariables: string[];
    defaultVariables: any;
    suppliedVariables: any;
    missingVariables: string[];
    constructor(dirPathArg: string);
    /**
     * read a template from a directory
     */
    readTemplateFromDir(): Promise<void>;
    /**
     * supply the variables to render the teplate with
     * @param variablesArg gets merged with this.suppliedVariables
     */
    supplyVariables(variablesArg: any): Promise<void>;
    /**
     * Will ask for the missing variables by cli interaction
     */
    askCliForMissingVariables(): Promise<void>;
    /**
     * writes a file to disk
     * @param destinationDirArg
     */
    writeToDisk(destinationDirArg: any): Promise<void>;
    /**
     * finds all variables in a Template in as string
     * e.g. myobject.someKey and myobject.someOtherKey
     */
    private _findVariablesInTemplate;
    /**
     * checks if supplied Variables satisfy the template
     */
    private _checkSuppliedVariables;
    /**
     * checks the smartscaf.yml default values at the root of a template
     * allows 2 ways of notation in YAML:
     * >> myObject.myKey.someDeeperKey: someValue
     * >> myObject.yourKey.yourDeeperKey: yourValue
     * or
     * >> myObject:
     * >>   - someKey:
     * >>     - someDeeperKey: someValue
     * >>   - yourKey:
     * >>     - yourDeeperKey: yourValue
     */
    private _checkDefaultVariables;
    /**
     * resolve template dependencies
     */
    private _resolveTemplateDependencies;
}
