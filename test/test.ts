import { expect, tap } from 'tapbundle'

import * as smartscaf from '../dist/index'

let testScafTemplate: smartscaf.ScafTemplate

tap.test('should create new Smartscaf instance', async () => {
  testScafTemplate = new smartscaf.ScafTemplate()
  expect(testScafTemplate).to.be.instanceof(smartscaf.ScafTemplate)
})

tap.test('Smartscaf instance -> should read a template directory', async () => {
  testScafTemplate.readTemplateFromDir('./test/test_template')
})

tap.start()
