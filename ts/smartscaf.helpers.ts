import * as plugins from './smartscaf.plugins'

/**
 * adds a variable in string dot notation to an already more or less expanded object
 */
export let deepAddToObject = async (objectArg, varStringArg: string, valueArg: string) => {
  let varNamesArray = varStringArg.split('.')
  let referencePointer = objectArg
  for (let i = 0; i !== varNamesArray.length; i++) {
    let varName = varNamesArray[i]

    // is there a next variable ?
    let varNameNext: string = (() => {
      if (varNamesArray[i + 1]) {
        return varNamesArray[i + 1]
      }
      return null
    })()

    // build the tree in suppliedVariables
    console.log(referencePointer)
    console.log(varName)
    if (!referencePointer[varName] && !varNameNext) {
      referencePointer[varName] = valueArg
      referencePointer = null
    } else if (!referencePointer[varName] && varNameNext) {
      referencePointer[varName] = {}
      referencePointer = referencePointer[varName]
    } else if (referencePointer[varName] && varNameNext) {
      referencePointer = referencePointer[varName]
    } else {
      throw new Error('Something is strange!')
    }
  }
}
