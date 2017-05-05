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
    this.missingVariables = await this._checkSuppliedVariables(variablesArg)
  }

  /**
   * Will ask for the missing variables by cli interaction
   */
  async askForMissingVariables () {
    this.missingVariables = await this._checkSuppliedVariables(variablesArg)
    
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
  private async _checkSuppliedVariables(variablesArg) {
    let missingVars: string[] = []
    for (let templateSmartFile of this.templateSmartfileArray) {
      let localMissingVars = await plugins.smarthbs.checkVarsSatisfaction(
        templateSmartFile.contents.toString(),
        variablesArg
      )
      missingVars = plugins.lodash.concat(missingVars, localMissingVars)
    }
    
    return missingVars
  }
}
