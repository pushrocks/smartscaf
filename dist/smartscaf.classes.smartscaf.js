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
    constructor() { }
    /**
     * read a template from a directory
     */
    readTemplateFromDir(dirArg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.templateObject = yield plugins.smartfile.fs.fileTreeToObject(dirArg, '**/*');
        });
    }
    writeWithVariables(variablesArg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._checkSuppliedVariables(variablesArg);
        });
    }
    /**
     * finds all variables in a Template
     */
    _findVariablesInTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * checks if supplied Variables satisfy the template
     */
    _checkSuppliedVariables(variablesArg) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ScafTemplate = ScafTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzY2FmLmNsYXNzZXMuc21hcnRzY2FmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQ0FBOEM7QUFXOUM7SUFLRSxnQkFBZSxDQUFDO0lBRWhCOztPQUVHO0lBQ0csbUJBQW1CLENBQUUsTUFBYzs7WUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNuRixDQUFDO0tBQUE7SUFFSyxrQkFBa0IsQ0FBRSxZQUFZOztZQUNwQyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLHdCQUF3Qjs7UUFFdEMsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDVyx1QkFBdUIsQ0FBRSxZQUFZOztRQUVuRCxDQUFDO0tBQUE7Q0FDRjtBQS9CRCxvQ0ErQkMifQ==