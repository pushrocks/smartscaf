"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * adds a variable in string dot notation to an already more or less expanded object
 */
exports.deepAddToObject = async (objectArg, varStringArg, valueArg) => {
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzY2FmLmhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9zbWFydHNjYWYuaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ1EsUUFBQSxlQUFlLEdBQUcsS0FBSyxFQUFFLFNBQVMsRUFBRSxZQUFvQixFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUN2RixJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQUksZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQiw2QkFBNkI7UUFDN0IsSUFBSSxXQUFXLEdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDOUIsSUFBSSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixPQUFPLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDN0I7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFTCxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzlDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUNyQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7U0FDekI7YUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxFQUFFO1lBQ3BELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMvQixnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QzthQUFNLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksV0FBVyxFQUFFO1lBQ25ELGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDMUM7S0FDRjtBQUNILENBQUMsQ0FBQyJ9