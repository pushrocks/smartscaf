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
                            if (this.defaultVariables[missingVariable]) {
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
                let template = yield plugins.smarthbs.getTemplateForString(smartfile.contents.toString());
                let renderedTemplateString = template(this.suppliedVariables);
                smartfile.contents = Buffer.from(renderedTemplateString);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBOEM7QUFDOUMsK0NBQThDO0FBVzlDO0lBQUE7UUFNRSxzQkFBaUIsR0FBUSxFQUFFLENBQUE7UUFDM0IscUJBQWdCLEdBQWEsRUFBRSxDQUFBO0lBb0hqQyxDQUFDO0lBbEhDOztPQUVHO0lBQ0csbUJBQW1CLENBQUUsVUFBa0I7O1lBQzNDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzlDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUMxRixNQUFNLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO1lBQ3JDLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUE7WUFDcEMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtRQUNyQyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxlQUFlLENBQUUsWUFBWTs7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQTtZQUNuRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtRQUM5RCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLHlCQUF5Qjs7WUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUE7WUFDNUQsSUFBSSxrQkFBa0IsR0FBRyxJ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