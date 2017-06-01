"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins = require("./smartscaf.plugins");
const helpers = require("./smartscaf.helpers");
class ScafTemplate {
    constructor() {
        this.suppliedVariables = {};
        this.missingVariables = [];
    }
    /**
     * read a template from a directory
     */
    readTemplateFromDir(dirPathArg) {
        return __awaiter(this, void 0, void 0, function* () {
            let dirPath = plugins.path.resolve(dirPathArg);
            this.templateSmartfileArray = yield plugins.smartfile.fs.fileTreeToObject(dirPath, '**/*');
            yield this._findVariablesInTemplate();
            yield this._checkSuppliedVariables();
            yield this._checkDefaultVariables();
        });
    }
    /**
     * supply the variables to render the teplate with
     * @param variablesArg gets merged with this.suppliedVariables
     */
    supplyVariables(variablesArg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.suppliedVariables = plugins.lodash.merge(this.suppliedVariables, variablesArg);
            this.missingVariables = yield this._checkSuppliedVariables();
        });
    }
    /**
     * Will ask for the missing variables by cli interaction
     */
    askCliForMissingVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            this.missingVariables = yield this._checkSuppliedVariables();
            let localSmartInteract = new plugins.smartinteract.SmartInteract();
            for (let missingVariable of this.missingVariables) {
                localSmartInteract.addQuestions([{
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
                    }]);
            }
            let answerBucket = yield localSmartInteract.runQueue();
            answerBucket.answerMap.forEach((answer) => __awaiter(this, void 0, void 0, function* () {
                yield helpers.deepAddToObject(this.suppliedVariables, answer.name, answer.value);
            }));
        });
    }
    writeToDisk(destinationDirArg) {
        return __awaiter(this, void 0, void 0, function* () {
            let smartfileArrayToWrite = plugins.lodash.cloneDeep(this.templateSmartfileArray);
            for (let smartfile of smartfileArrayToWrite) {
                // render the template
                let template = yield plugins.smarthbs.getTemplateForString(smartfile.contents.toString());
                let renderedTemplateString = template(this.suppliedVariables);
                // handle frontmatter
                let parsedTemplate = plugins.smartfm.parse(renderedTemplateString);
                if (parsedTemplate.data.fileName) {
                    smartfile.updateFileName(parsedTemplate.data.fileName);
                }
                smartfile.contents = Buffer.from(parsedTemplate.content);
            }
            yield plugins.smartfile.memory.smartfileArrayToFs(smartfileArrayToWrite, destinationDirArg);
        });
    }
    /**
     * finds all variables in a Template in as string
     * e.g. myobject.someKey and myobject.someOtherKey
     */
    _findVariablesInTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            let templateVariables = [];
            for (let templateSmartfile of this.templateSmartfileArray) {
                let localTemplateVariables = yield plugins.smarthbs.findVarsInHbsString(templateSmartfile.contents.toString());
                templateVariables = plugins.lodash.concat(templateVariables, localTemplateVariables);
            }
            templateVariables = plugins.lodash.uniq(templateVariables);
        });
    }
    /**
     * checks if supplied Variables satisfy the template
     */
    _checkSuppliedVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            let missingVars = [];
            for (let templateSmartfile of this.templateSmartfileArray) {
                let localMissingVars = yield plugins.smarthbs.checkVarsSatisfaction(templateSmartfile.contents.toString(), this.suppliedVariables);
                missingVars = plugins.lodash.concat(missingVars, localMissingVars);
            }
            missingVars = plugins.lodash.uniq(missingVars);
            return missingVars;
        });
    }
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
    _checkDefaultVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            let defaultsSmartfile = this.templateSmartfileArray.filter(smartfileArg => {
                return smartfileArg.parsedPath.base === 'defaults.yml';
            })[0];
            if (defaultsSmartfile) {
                let defaultObject = yield plugins.smartyaml.yamlStringToObject(defaultsSmartfile.contents.toString());
                this.defaultVariables = defaultObject;
            }
            else {
                this.defaultVariables = {};
            }
        });
    }
}
exports.ScafTemplate = ScafTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBOEM7QUFDOUMsK0NBQThDO0FBVzlDO0lBQUE7UUFNRSxzQkFBaUIsR0FBUSxFQUFFLENBQUE7UUFDM0IscUJBQWdCLEdBQWEsRUFBRSxDQUFBO0lBOEhqQyxDQUFDO0lBNUhDOztPQUVHO0lBQ0csbUJBQW1CLENBQUUsVUFBa0I7O1lBQzNDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzlDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUMxRixNQUFNLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO1lBQ3JDLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUE7WUFDcEMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtRQUNyQyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxlQUFlLENBQUUsWUFBWTs7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQTtZQUNuRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtRQUM5RCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLHlCQUF5Qjs7WUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUE7WUFDNUQsSUFBSSxrQkFBa0IsR0FBRyxJ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