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
        console.log(referencePointer);
        console.log(varName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9zbWFydHNjYWYuaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7O0dBRUc7QUFDUSxRQUFBLGVBQWUsR0FBRyxDQUFPLFNBQVMsRUFBRSxZQUFvQixFQUFFLFFBQWdCO0lBQ25GLElBQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDM0MsSUFBSSxnQkFBZ0IsR0FBRyxTQUFTLENBQUE7SUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDaEQsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRTlCLDZCQUE2QjtRQUM3QixJQUFJLFdBQVcsR0FBVyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUM3QixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUNiLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFFSixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFBO1lBQ3BDLGdCQUFnQixHQUFHLElBQUksQ0FBQTtRQUN6QixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNyRCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7WUFDOUIsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDOUMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3BELGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzlDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtRQUMxQyxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFBIn0=