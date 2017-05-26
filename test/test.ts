import { expect, tap } from 'tapbundle'
import * as path from 'path'

import * as smartscaf from '../dist/index'

process.env.CI = 'true'

let testScafTemplate: smartscaf.ScafTemplate

tap.test('should create new Smartscaf instance', async () => {
  testScafTemplate = new smartscaf.ScafTemplate()
  expect(testScafTemplate).to.be.instanceof(smartscaf.ScafTemplate)
})

tap.test('Smartscaf instance -> should read a template directory', async () => {
  await testScafTemplate.readTemplateFromDir('./test/test_template')
  expect(testScafTemplate.templateSmartfileArray.length).to.equal(4)
})

tap.test('smartfile -> should accept variables', async () => {
  await testScafTemplate.supplyVariables({})
  console.log(testScafTemplate.missingVariables)
})

tap.test('ask cli', async () => {
  await testScafTemplate.askCliForMissingVariables()
})

tap.test('should output ready rendered template', async () => {
  await testScafTemplate.writeToDisk(path.resolve('./test/test_output'))
})

tap.start()
