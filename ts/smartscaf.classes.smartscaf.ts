import * as plugins from './smartscaf.plugins';
import * as interfaces from './interfaces';
import * as helpers from './smartscaf.helpers';

// interfaces
import { Smartfile } from '@pushrocks/smartfile';

export interface ScafTemplateContructorOptions {
  name?: string;
  description?: string;
  sourceDir?: string;
}

export class ScafTemplate {
  public static async createTemplateFromDir() {}

  /**
   * the name of the template
   */
  public name: string;

  /**
   * the descriptions of the template
   */
  public description: string;

  /**
   * the location on disk of the template
   */
  public dirPath: string;
  public destinationPath: string;

  /**
   * smartscafFile
   */
  public smartscafFile: interfaces.ISmartscafFile;

  /**
   * the files of the template as array of Smartfiles
   */
  public templateSmartfileArray: Smartfile[];
  public requiredVariables: string[];
  public defaultVariables: any;
  public suppliedVariables: any = {};
  public missingVariables: string[] = [];

  constructor(dirPathArg: string) {
    this.dirPath = plugins.path.resolve(dirPathArg);
  }

  /**
   * read a template from a directory
   */
  public async readTemplateFromDir() {
    this.templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(this.dirPath, '**/*');

    // read .smartscaf.yml file
    let smartscafFile: interfaces.ISmartscafFile = {
      defaults: {},
      dependencies: {
        merge: []
      },
      runafter: []
    };

    const smartscafSmartfile = this.templateSmartfileArray.find(smartfileArg => {
      return smartfileArg.parsedPath.base === '.smartscaf.yml';
    });

    if (smartscafSmartfile) {
      smartscafFile = {
        ...smartscafFile,
        ...await plugins.smartyaml.yamlStringToObject(smartscafSmartfile.contentBuffer.toString())
      };
    }
    this.smartscafFile = smartscafFile;

    await this._resolveTemplateDependencies();
    await this._findVariablesInTemplate();
    await this._checkSuppliedVariables();
    await this._checkDefaultVariables();
  }

  /**
   * supply the variables to render the teplate with
   * @param variablesArg gets merged with this.suppliedVariables
   */
  public async supplyVariables(variablesArg) {
    this.suppliedVariables = {
      ...this.suppliedVariables,
      ...variablesArg
    };
    this.missingVariables = await this._checkSuppliedVariables();
  }

  /**
   * Will ask for the missing variables by cli interaction
   */
  public async askCliForMissingVariables() {
    this.missingVariables = await this._checkSuppliedVariables();
    const localSmartInteract = new plugins.smartinteract.SmartInteract();
    for (const missingVariable of this.missingVariables) {
      localSmartInteract.addQuestions([
        {
          name: missingVariable,
          type: 'input',
          default: (() => {
            if (this.defaultVariables && this.defaultVariables[missingVariable]) {
              return this.defaultVariables[missingVariable];
            } else {
              return 'undefined variable';
            }
          })(),
          message: `What is the value of ${missingVariable}?`
        }
      ]);
    }
    const answerBucket = await localSmartInteract.runQueue();
    await answerBucket.answerMap.forEach(async answer => {
      await helpers.deepAddToObject(this.suppliedVariables, answer.name, answer.value);
    });
  }

  /**
   * writes a file to disk
   * @param destinationDirArg
   */
  public async writeToDisk(destinationDirArg) {
    this.destinationPath = destinationDirArg;
    const smartfileArrayToWrite: Smartfile[] = [];
    for (const smartfile of this.templateSmartfileArray) {
      // lets filter out template files
      if (smartfile.path === '.smartscaf.yml') {
        continue;
      }

      // render the template
      const template = await plugins.smarthbs.getTemplateForString(smartfile.contents.toString());
      const renderedTemplateString = template(this.suppliedVariables);

      // handle frontmatter
      const smartfmInstance = new plugins.smartfm.Smartfm({
        fmType: 'yaml'
      });
      const parsedTemplate = smartfmInstance.parse(renderedTemplateString) as any;
      if (parsedTemplate.data.fileName) {
        smartfile.updateFileName(parsedTemplate.data.fileName);
      }

      smartfile.contents = Buffer.from(parsedTemplate.content);
      smartfileArrayToWrite.push(smartfile);
    }

    await plugins.smartfile.memory.smartfileArrayToFs(smartfileArrayToWrite, destinationDirArg);
    await this.runScripts();
  }

  /**
   * finds all variables in a Template in as string
   * e.g. myobject.someKey and myobject.someOtherKey
   */
  private async _findVariablesInTemplate() {
    let templateVariables: string[] = [];
    for (const templateSmartfile of this.templateSmartfileArray) {
      const localTemplateVariables = await plugins.smarthbs.findVarsInHbsString(
        templateSmartfile.contents.toString()
      );
      templateVariables = [...templateVariables, ...localTemplateVariables];
    }
    templateVariables = templateVariables.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  /**
   * checks if supplied Variables satisfy the template
   */
  private async _checkSuppliedVariables() {
    let missingVars: string[] = [];
    for (const templateSmartfile of this.templateSmartfileArray) {
      const localMissingVars = await plugins.smarthbs.checkVarsSatisfaction(
        templateSmartfile.contents.toString(),
        this.suppliedVariables
      );

      // combine with other missingVars
      missingVars = [...missingVars, ...localMissingVars];
    }

    // dedupe
    missingVars = missingVars.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    return missingVars;
  }

  /**
   * checks the smartscaf.yml default values at the root of a template
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
  private async _checkDefaultVariables() {
    const smartscafSmartfile = this.templateSmartfileArray.find(smartfileArg => {
      return smartfileArg.parsedPath.base === '.smartscaf.yml';
    });

    if (smartscafSmartfile) {
      const smartscafObject = await plugins.smartyaml.yamlStringToObject(
        smartscafSmartfile.contents.toString()
      );
      const defaultObject = smartscafObject.defaults;
      this.defaultVariables = defaultObject;
    }

    // safeguard against non existent defaults
    if (!this.defaultVariables) {
      console.log('this template does not specify defaults');
      this.defaultVariables = {};
    }
  }

  /**
   * resolve template dependencies
   */
  private async _resolveTemplateDependencies() {
    console.log('looking at templates to merge!');
    for (const dependency of this.smartscafFile.dependencies.merge) {
      console.log(`Now resolving ${dependency}`);
      const templatePathToMerge = plugins.path.join(this.dirPath, dependency);
      if (!plugins.smartfile.fs.isDirectory(templatePathToMerge)) {
        console.log(
          `dependency ${dependency} resolves to ${templatePathToMerge} which ist NOT a directory`
        );
        continue;
      }
      const templateSmartfileArray = await plugins.smartfile.fs.fileTreeToObject(
        templatePathToMerge,
        '**/*'
      );
      this.templateSmartfileArray = this.templateSmartfileArray.concat(templateSmartfileArray);
    }
  }

  private async runScripts () {
    if (!this.destinationPath) {
      throw new Error('cannot run scripts without an destinationdir');
    }
    const smartshellInstance = new plugins.smartshell.Smartshell({
      executor: 'bash'
    });
    for (const command of this.smartscafFile.runafter) {
      await smartshellInstance.exec(`cd ${this.destinationPath} && ${command}`);
    }
  }
}
