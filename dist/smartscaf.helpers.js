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
/**
 * adds a variable in string dot notation to an already more or less expanded object
 */
exports.deepAddToObject = (objectArg, varStringArg, valueArg) => __awaiter(this, void 0, void 0, function* () {
    let varNamesArray = varStringArg.split('.');
    let referencePointer = objectArg;
    for (let i = 0; i !== varNamesArray.length; i++) {
        let varName = varNamesArray[i];
        // is there a next variable ?
        let varNameNext = (() => {
            if (varNamesArray[i + 1]) {
                return varNamesArray[i + 1];
            }
            return null;
        })();
        // build the tree in suppliedVariables
        if (!referencePointer[varName] && !varNameNext) {
            referencePointer[varName] = valueArg;
            referencePointer = null;
        }
        else if (!referencePointer[varName] && varNameNext) {
            referencePointer[varName] = {};
            referencePointer = referencePointer[varName];
        }
        else if (referencePointer[varName] && varNameNext) {
            referencePointer = referencePointer[varName];
        }
        else {
            throw new Error('Something is strange!');
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9zbWFydHNjYWYuaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7O0dBRUc7QUFDUSxRQUFBLGVBQWUsR0FBRyxDQUFPLFNBQVMsRUFBRSxZQUFvQixFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUN2RixJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzNDLElBQUksZ0JBQWdCLEdBQUcsU0FBUyxDQUFBO0lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUU5Qiw2QkFBNkI7UUFDN0IsSUFBSSxXQUFXLEdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDOUIsSUFBSSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixPQUFPLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7YUFDNUI7WUFDRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFFSixzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzlDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQTtZQUNwQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7U0FDeEI7YUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxFQUFFO1lBQ3BELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtZQUM5QixnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUM3QzthQUFNLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxFQUFFO1lBQ25ELGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQzdDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUE7U0FDekM7S0FDRjtBQUNILENBQUMsQ0FBQSxDQUFBIn0=