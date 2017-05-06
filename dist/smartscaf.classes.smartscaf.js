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
class ScafTemplate {
    constructor() {
        this.missingVariables = [];
    }
    /**
     * read a template from a directory
     */
    readTemplateFromDir(dirPathArg) {
        return __awaiter(this, void 0, void 0, function* () {
            let dirPath = plugins.path.resolve(dirPathArg);
            this.templateSmartfileArray = yield plugins.smartfile.fs.fileTreeToObject(dirPath, '**/*');
            this._findVariablesInTemplate();
        });
    }
    /**
     * supply the variables to render the teplate with
     * @param variablesArg
     */
    supplyVariables(variablesArg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.suppliedVariables = variablesArg;
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
                        default: `undefined ${missingVariable}`,
                        message: `What is the value of ${missingVariable}?`
                    }]);
            }
            let answers = yield localSmartInteract.runQueue();
        });
    }
    /**
     * finds all variables in a Template
     */
    _findVariablesInTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let localSmartfile of this.templateSmartfileArray) {
            }
        });
    }
    /**
     * checks if supplied Variables satisfy the template
     */
    _checkSuppliedVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            let missingVars = [];
            for (let templateSmartFile of this.templateSmartfileArray) {
                let localMissingVars = yield plugins.smarthbs.checkVarsSatisfaction(templateSmartFile.contents.toString(), this.suppliedVariables);
                missingVars = plugins.lodash.concat(missingVars, localMissingVars);
                missingVars = plugins.lodash.uniq(missingVars);
            }
            return missingVars;
        });
    }
}
exports.ScafTemplate = ScafTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBOEM7QUFXOUM7SUFBQTtRQU1FLHFCQUFnQixHQUFhLEVBQUUsQ0FBQTtJQTZEakMsQ0FBQztJQTNEQzs7T0FFRztJQUNHLG1CQUFtQixDQUFFLFVBQWtCOztZQUMzQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDMUYsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUE7UUFDakMsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csZUFBZSxDQUFFLFlBQVk7O1lBQ2pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZLENBQUE7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUE7UUFDOUQsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDRyx5QkFBeUI7O1lBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFBO1lBQzVELElBQUksa0JBQWtCLEdBQUcsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQ2xFLEdBQUcsQ0FBQyxDQUFDLElBQUksZUFBZSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUMvQixJQUFJLEVBQUUsZUFBZTt3QkFDckIsSUFBSSxFQUFFLE9BQU87d0JBQ2IsT0FBTyxFQUFFLGFBQWEsZUFBZSxFQUFFO3dCQUN2QyxPQUFPLEVBQUUsd0JBQXdCLGVBQWUsR0FBRztxQkFDcEQsQ0FBQyxDQUFDLENBQUE7WUFDTCxDQUFDO1lBQ0QsSUFBSSxPQUFPLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNuRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLHdCQUF3Qjs7WUFDcEMsR0FBRyxDQUFDLENBQUMsSUFBSSxjQUFjLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUV6RCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVyx1QkFBdUI7O1lBQ25DLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQTtZQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUNqRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FDdkIsQ0FBQTtnQkFDRCxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2xFLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNoRCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQTtRQUNwQixDQUFDO0tBQUE7Q0FDRjtBQW5FRCxvQ0FtRUMifQ==