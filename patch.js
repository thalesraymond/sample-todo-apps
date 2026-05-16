const fs = require('fs')

let testFile = fs.readFileSync('typescript/tests/unit/shared/errors/error-handler.test.ts', 'utf8')
testFile = testFile.replace(
  "import { BadRequestError } from '../../../../src/shared/errors/http-error.js'",
  "import { BadRequestError, NotFoundError } from '../../../../src/shared/errors/http-error.js'"
)

fs.writeFileSync('typescript/tests/unit/shared/errors/error-handler.test.ts', testFile)

let errorHandler = fs.readFileSync('typescript/src/shared/errors/error-handler.ts', 'utf8')
errorHandler = errorHandler.replace(
  "function isValidationError(error: FastifyError): boolean {\n  return error.validation !== undefined\n}",
  "function isValidationError(error: FastifyError): boolean {\n  return error && error.validation !== undefined\n}"
)
fs.writeFileSync('typescript/src/shared/errors/error-handler.ts', errorHandler)
