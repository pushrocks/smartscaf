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
            this.missingVariables = yield this._checkSuppliedVariables(variablesArg);
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
    _checkSuppliedVariables(variablesArg) {
        return __awaiter(this, void 0, void 0, function* () {
            let missingVars = [];
            for (let templateSmartFile of this.templateSmartfileArray) {
                let localMissingVars = yield plugins.smarthbs.checkVarsSatisfaction(templateSmartFile.contents.toString(), variablesArg);
                missingVars = plugins.lodash.concat(missingVars, localMissingVars);
            }
            return missingVars;
        });
    }
}
exports.ScafTemplate = ScafTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBOEM7QUFXOUM7SUFBQTtRQU1FLHFCQUFnQixHQUFhLEVBQUUsQ0FBQTtJQTRDakMsQ0FBQztJQTFDQzs7T0FFRztJQUNHLG1CQUFtQixDQUFFLFVBQWtCOztZQUMzQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDMUYsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUE7UUFDakMsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csZUFBZSxDQUFFLFlBQVk7O1lBQ2pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZLENBQUE7WUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQzFFLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ1csd0JBQXdCOztZQUNwQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBRXpELENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLHVCQUF1QixDQUFDLFlBQVk7O1lBQ2hELElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQTtZQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUNqRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQ3JDLFlBQVksQ0FDYixDQUFBO2dCQUNELFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRSxDQUFDO1lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQTtRQUNwQixDQUFDO0tBQUE7Q0FDRjtBQWxERCxvQ0FrREMifQ==