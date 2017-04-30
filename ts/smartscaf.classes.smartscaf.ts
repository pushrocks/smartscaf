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

  /**
   * read a template from a directory
   */
  async readTemplateFromDir (dirArg: string) {
    this.templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirArg, '**/*')
    this._findVariablesInTemplate()
  }

  /**
   * supply the variables to render the teplate with
   * @param variablesArg
   */
  async supplyVariables (variablesArg) {
    await this._checkSuppliedVariables(variablesArg)
  }

  /**
   * finds all variables in a Template
   */
  private async _findVariablesInTemplate () {
    for (let localSmartfile of this.templateSmartfileArray) {
      
    }
  }

  /**
   * checks if supplied Variables satisfy the template
   */
  private async _checkSuppliedVariables (variablesArg) {
    
  }
}
