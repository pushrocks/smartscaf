import * as plugins from './smartscaf.plugins'
import * as helpers from './smartscaf.helpers'

// interfaces
import { Smartfile } from 'smartfile'

export interface ScafTemplateContructorOptions {
  name?: string,
  description?: string
  sourceDir?: string
}

export class ScafTemplate {
  name: string
  description: string
  templateSmartfileArray: Smartfile[]
  requiredVariables: string[]
  defaultVariables: any
  suppliedVariables: any = {}
  missingVariables: string[] = []

  /**
   * read a template from a directory
   */
  async readTemplateFromDir (dirPathArg: string) {
    let dirPath = plugins.path.resolve(dirPathArg)
    this.templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirPath, '**/*')
    await this._findVariablesInTemplate()
    await this._checkSuppliedVariables()
    await this._checkDefaultVariables()
  }

  /**
   * supply the variables to render the teplate with
   * @param variablesArg gets merged with this.suppliedVariables
   */
  async supplyVariables (variablesArg) {
    this.suppliedVariables = plugins.lodash.merge(this.suppliedVariables, variablesArg)
    this.missingVariables = await this._checkSuppliedVariables()
  }

  /**
   * Will ask for the missing variables by cli interaction
   */
  async askCliForMissingVariables () {
    this.missingVariables = await this._checkSuppliedVariables()
    let localSmartInteract = new plugins.smartinteract.SmartInteract()
    for (let missingVariable of this.missingVariables) {
      localSmartInteract.addQuestions([{
        name: missingVariable,
        type: 'input',
        default: (() => {
          if (this.defaultVariables[missingVariable]) {
            return this.defaultVariables[missingVariable]
          } else {
            return 'undefined variable'
          }
        })(),
        message: `What is the value of ${missingVariable}?`
      }])
    }
    let answerBucket = await localSmartInteract.runQueue()
    answerBucket.answerMap.forEach(async answer => {
      await helpers.deepAddToObject(this.suppliedVariables, answer.name, answer.value)
    })

  }

  /**
   * finds all variables in a Template in as string
   * e.g. myobject.someKey and myobject.someOtherKey
   */
  private async _findVariablesInTemplate () {
    let templateVariables: string[] = []
    for (let templateSmartfile of this.templateSmartfileArray) {
      let localTemplateVariables = await plugins.smarthbs.findVarsInHbsString(templateSmartfile.contents.toString())
      templateVariables = plugins.lodash.concat(templateVariables, localTemplateVariables)
    }
    templateVariables = plugins.lodash.uniq(templateVariables)
  }

  /**
   * checks if supplied Variables satisfy the template
   */
  private async _checkSuppliedVariables () {
    let missingVars: string[] = []
    for (let templateSmartfile of this.templateSmartfileArray) {
      let localMissingVars = await plugins.smarthbs.checkVarsSatisfaction(
        templateSmartfile.contents.toString(),
        this.suppliedVariables
      )
      missingVars = plugins.lodash.concat(missingVars, localMissingVars)
    }
    missingVars = plugins.lodash.uniq(missingVars)
    return missingVars
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
  private async _checkDefaultVariables () {
    let defaultsSmartfile = this.templateSmartfileArray.filter(smartfileArg => {
      return smartfileArg.parsedPath.base === 'defaults.yml'
    })[0]

    if (defaultsSmartfile) {
      let defaultObject = await plugins.smartyaml.yamlStringToObject(
        defaultsSmartfile.contents.toString()
      )
      this.defaultVariables = defaultObject
    } else {
      this.defaultVariables = {}
    }
  }
}
