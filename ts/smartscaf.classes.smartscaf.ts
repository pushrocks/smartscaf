import * as plugins from './smartscaf.plugins'

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
  suppliedVariables: any
  missingVariables: string[] = []

  /**
   * read a template from a directory
   */
  async readTemplateFromDir (dirPathArg: string) {
    let dirPath = plugins.path.resolve(dirPathArg)
    this.templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirPath, '**/*')
    this._findVariablesInTemplate()
  }

  /**
   * supply the variables to render the teplate with
   * @param variablesArg
   */
  async supplyVariables (variablesArg) {
    this.suppliedVariables = variablesArg
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
        default: `undefined ${missingVariable}`,
        message: `What is the value of ${missingVariable}?`
      }])
    }
    let answers = await localSmartInteract.runQueue()
  }

  /**
   * finds all variables in a Template
   */
  private async _findVariablesInTemplate() {
    for (let localSmartfile of this.templateSmartfileArray) {

    }
  }

  /**
   * checks if supplied Variables satisfy the template
   */
  private async _checkSuppliedVariables() {
    let missingVars: string[] = []
    for (let templateSmartFile of this.templateSmartfileArray) {
      let localMissingVars = await plugins.smarthbs.checkVarsSatisfaction(
        templateSmartFile.contents.toString(),
        this.suppliedVariables
      )
      missingVars = plugins.lodash.concat(missingVars, localMissingVars)
      missingVars = plugins.lodash.uniq(missingVars)
    }
    return missingVars
  }
}
