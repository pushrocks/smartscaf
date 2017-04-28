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
  templateObject: Smartfile[]
  requiredVariables: any[]
  constructor() {}

  /**
   * read a template from a directory
   */
  async readTemplateFromDir (dirArg: string) {
    this.templateObject = await plugins.smartfile.fs.fileTreeToObject(dirArg, '**/*')
  }

  async writeWithVariables (variablesArg) {
    await this._checkSuppliedVariables(variablesArg)
  }

  /**
   * finds all variables in a Template
   */
  private async _findVariablesInTemplate () {

  }

  /**
   * checks if supplied Variables satisfy the template
   */
  private async _checkSuppliedVariables (variablesArg) {

  }
}
