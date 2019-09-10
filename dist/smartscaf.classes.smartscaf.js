"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins = __importStar(require("./smartscaf.plugins"));
const helpers = __importStar(require("./smartscaf.helpers"));
class ScafTemplate {
    constructor(dirPathArg) {
        this.suppliedVariables = {};
        this.missingVariables = [];
        this.dirPath = plugins.path.resolve(dirPathArg);
    }
    static async createTemplateFromDir() { }
    /**
     * read a template from a directory
     */
    async readTemplateFromDir() {
        this.templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(this.dirPath, '**/*');
        await this._resolveTemplateDependencies();
        await this._findVariablesInTemplate();
        await this._checkSuppliedVariables();
        await this._checkDefaultVariables();
    }
    /**
     * supply the variables to render the teplate with
     * @param variablesArg gets merged with this.suppliedVariables
     */
    async supplyVariables(variablesArg) {
        this.suppliedVariables = Object.assign(Object.assign({}, this.suppliedVariables), variablesArg);
        this.missingVariables = await this._checkSuppliedVariables();
    }
    /**
     * Will ask for the missing variables by cli interaction
     */
    async askCliForMissingVariables() {
        this.missingVariables = await this._checkSuppliedVariables();
        let localSmartInteract = new plugins.smartinteract.SmartInteract();
        for (let missingVariable of this.missingVariables) {
            localSmartInteract.addQuestions([
                {
                    name: missingVariable,
                    type: 'input',
                    default: (() => {
                        if (this.defaultVariables && this.defaultVariables[missingVariable]) {
                            return this.defaultVariables[missingVariable];
                        }
                        else {
                            return 'undefined variable';
                        }
                    })(),
                    message: `What is the value of ${missingVariable}?`
                }
            ]);
        }
        let answerBucket = await localSmartInteract.runQueue();
        await answerBucket.answerMap.forEach(async (answer) => {
            await helpers.deepAddToObject(this.suppliedVariables, answer.name, answer.value);
        });
    }
    /**
     * writes a file to disk
     * @param destinationDirArg
     */
    async writeToDisk(destinationDirArg) {
        const smartfileArrayToWrite = [];
        for (let smartfile of this.templateSmartfileArray) {
            // lets filter out template files
            if (smartfile.path === '.smartscaf.yml') {
                continue;
            }
            // render the template
            let template = await plugins.smarthbs.getTemplateForString(smartfile.contents.toString());
            let renderedTemplateString = template(this.suppliedVariables);
            // handle frontmatter
            const smartfmInstance = new plugins.smartfm.Smartfm({
                fmType: 'yaml'
            });
            let parsedTemplate = smartfmInstance.parse(renderedTemplateString);
            if (parsedTemplate.data.fileName) {
                smartfile.updateFileName(parsedTemplate.data.fileName);
            }
            smartfile.contents = Buffer.from(parsedTemplate.content);
            smartfileArrayToWrite.push(smartfile);
        }
        await plugins.smartfile.memory.smartfileArrayToFs(smartfileArrayToWrite, destinationDirArg);
    }
    /**
     * finds all variables in a Template in as string
     * e.g. myobject.someKey and myobject.someOtherKey
     */
    async _findVariablesInTemplate() {
        let templateVariables = [];
        for (let templateSmartfile of this.templateSmartfileArray) {
            let localTemplateVariables = await plugins.smarthbs.findVarsInHbsString(templateSmartfile.contents.toString());
            templateVariables = [...templateVariables, ...localTemplateVariables];
        }
        templateVariables = templateVariables.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }
    /**
     * checks if supplied Variables satisfy the template
     */
    async _checkSuppliedVariables() {
        let missingVars = [];
        for (let templateSmartfile of this.templateSmartfileArray) {
            let localMissingVars = await plugins.smarthbs.checkVarsSatisfaction(templateSmartfile.contents.toString(), this.suppliedVariables);
            // combine with other missingVars
            missingVars = [...missingVars, ...localMissingVars];
        }
        // dedupe
        missingVars = missingVars.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        return missingVars;
    }
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
    async _checkDefaultVariables() {
        let smartscafSmartfile = this.templateSmartfileArray.find(smartfileArg => {
            return smartfileArg.parsedPath.base === '.smartscaf.yml';
        });
        if (smartscafSmartfile) {
            const smartscafObject = await plugins.smartyaml.yamlStringToObject(smartscafSmartfile.contents.toString());
            const defaultObject = smartscafObject.defaults;
            this.defaultVariables = defaultObject;
        }
        // safeguard against non existent defaults
        if (!this.defaultVariables) {
            console.log('this template does not specify defaults');
            this.defaultVariables = {};
        }
    }
    /**
     * resolve template dependencies
     */
    async _resolveTemplateDependencies() {
        const smartscafSmartfile = this.templateSmartfileArray.find(smartfileArg => {
            return smartfileArg.parsedPath.base === '.smartscaf.yml';
        });
        if (!smartscafSmartfile) {
            console.log('No further template dependencies defined!');
            return;
        }
        console.log('Found template dependencies! Resolving them now!');
        console.log('looking at templates to merge!');
        const smartscafYamlObject = await plugins.smartyaml.yamlStringToObject(smartscafSmartfile.contentBuffer.toString());
        if (!smartscafYamlObject) {
            console.log('Something seems strange about the supplied dependencies.yml file.');
            return;
        }
        for (const dependency of smartscafYamlObject.dependencies.merge) {
            console.log(`Now resolving ${dependency}`);
            const templatePathToMerge = plugins.path.join(this.dirPath, dependency);
            if (!plugins.smartfile.fs.isDirectory(templatePathToMerge)) {
                console.log(`dependency ${dependency} resolves to ${templatePathToMerge} which ist NOT a directory`);
                continue;
            }
            const templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(templatePathToMerge, '**/*');
            this.templateSmartfileArray = this.templateSmartfileArray.concat(templateSmartfileArray);
        }
    }
}
exports.ScafTemplate = ScafTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDZEQUErQztBQUMvQyw2REFBK0M7QUFXL0MsTUFBYSxZQUFZO0lBMkJ2QixZQUFZLFVBQWtCO1FBSDlCLHNCQUFpQixHQUFRLEVBQUUsQ0FBQztRQUM1QixxQkFBZ0IsR0FBYSxFQUFFLENBQUM7UUFHOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBNUJELE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEtBQUksQ0FBQztJQThCdkM7O09BRUc7SUFDSCxLQUFLLENBQUMsbUJBQW1CO1FBQ3ZCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEcsTUFBTSxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUMxQyxNQUFNLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGVBQWUsQ0FBQyxZQUFZO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsbUNBQ2pCLElBQUksQ0FBQyxpQkFBaUIsR0FDdEIsWUFBWSxDQUNoQixDQUFDO1FBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FB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