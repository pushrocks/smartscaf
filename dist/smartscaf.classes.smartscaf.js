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
            this.suppliedVariables = Object.assign({}, this.suppliedVariables, variablesArg);
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
            let answerBucket = yield localSmartInteract.runQueue();
            answerBucket.answerMap.forEach((answer) => __awaiter(this, void 0, void 0, function* () {
                yield helpers.deepAddToObject(this.suppliedVariables, answer.name, answer.value);
            }));
        });
    }
    writeToDisk(destinationDirArg) {
        return __awaiter(this, void 0, void 0, function* () {
            let smartfileArrayToWrite = this.templateSmartfileArray;
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
                templateVariables = [...templateVariables, ...localTemplateVariables];
            }
            templateVariables = templateVariables.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
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
                missingVars = [
                    ...missingVars,
                    ...localMissingVars
                ];
            }
            missingVars = missingVars.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBK0M7QUFDL0MsK0NBQStDO0FBVy9DO0lBQUE7UUFNRSxzQkFBaUIsR0FBUSxFQUFFLENBQUM7UUFDNUIscUJBQWdCLEdBQWEsRUFBRSxDQUFDO0lBd0lsQyxDQUFDO0lBdElDOztPQUVHO0lBQ0csbUJBQW1CLENBQUMsVUFBa0I7O1lBQzFDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRixNQUFNLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQ3RDLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFRDs7O09BR0c7SUFDRyxlQUFlLENBQUMsWUFBWTs7WUFDaEMsSUFBSSxDQUFDLGlCQUFpQixxQkFDakIsSUFBSSxDQUFDLGlCQUFpQixFQUN0QixZQUFZLENBQ2hCLENBQUM7WUFDRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNHLHlCQUF5Qjs7WUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDN0QsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbkUsS0FBSyxJQUFJLGVBQWUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2pELGtCQUFrQixDQUFDLFlBQVksQ0FBQztvQkFDOUI7d0JBQ0UsSUFBSSxFQUFFLGVBQWU7d0JBQ3JCLElBQUksRUFBRSxPQUFPO3dCQUNiLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRTs0QkFDYixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0NBQ25FLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDOzZCQUMvQztpQ0FBTTtnQ0FDTCxPQUFPLG9CQUFvQixDQUFDOzZCQUM3Qjt3QkFDSCxDQUFDLENBQUMsRUFBRTt3QkFDSixPQUFPLEVBQUUsd0JBQXdCLGVBQWUsR0FBRztxQkFDcEQ7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxJQUFJLFlBQVksR0FBRyxNQUFNLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3ZELFlBQVksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQU0sTUFBTSxFQUFDLEVBQUU7Z0JBQzVDLE1BQU0sT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxpQkFBaUI7O1lBQ2pDLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO1lBQ3hELEtBQUssSUFBSSxTQUFTLElBQUkscUJBQXFCLEVBQUU7Z0JBQzNDLHNCQUFzQjtnQkFDdEIsSUFBSSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDMUYsSUFBSSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBRTlELHFCQUFxQjtnQkFDckIsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDaEMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN4RDtnQkFFRCxTQUFTLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzFEO1lBRUQsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlGLENBQUM7S0FBQTtJQUVEOzs7T0FHRztJQUNXLHdCQUF3Qjs7WUFDcEMsSUFBSSxpQkFBaUIsR0FBYSxFQUFFLENBQUM7WUFDckMsS0FBSyxJQUFJLGlCQUFpQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtnQkFDekQsSUFBSSxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQ3JFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FDdEMsQ0FBQztnQkFDRixpQkFBaUIsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLEVBQUUsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDbEUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1csdUJBQXVCOztZQUNuQyxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7WUFDL0IsS0FBSyxJQUFJLGlCQUFpQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtnQkFDekQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQ2pFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFDckMsSUFBSSxDQUFDLGlCQUFpQixDQUN2QixDQUFDO2dCQUNGLFdBQVcsR0FBRztvQkFDWixHQUFHLFdBQVc7b0JBQ2QsR0FBRyxnQkFBZ0I7aUJBQ3BCLENBQUM7YUFDSDtZQUNELFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDdEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ1csc0JBQXNCOztZQUNsQyxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ3hFLE9BQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssY0FBYyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRU4sSUFBSSxpQkFBaUIsRUFBRTtnQkFDckIsSUFBSSxhQUFhLEdBQUcsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUM1RCxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQ3RDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQzthQUN2QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO2FBQzVCO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUEvSUQsb0NBK0lDIn0=