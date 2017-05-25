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
    defaultVariables: any;
    suppliedVariables: any;
    missingVariables: string[];
    /**
     * read a template from a directory
     */
    readTemplateFromDir(dirPathArg: string): Promise<void>;
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
     * finds all variables in a Template in as string
     * e.g. myobject.someKey and myobject.someOtherKey
     */
    private _findVariablesInTemplate();
    /**
     * checks if supplied Variables satisfy the template
     */
    private _checkSuppliedVariables();
    /**
     * checks the default.yml at the root of a template for default variables
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
    private _checkDefaultVariables();
}
