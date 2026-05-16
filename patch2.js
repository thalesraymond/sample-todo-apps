const fs = require('fs')
let code = fs.readFileSync('typescript/tests/unit/shared/errors/error-handler.test.ts', 'utf8')
code = code.replace(/}\)\n\n  it\('should handle other HttpErrors/g, "  it('should handle other HttpErrors")
code += "})\n"
fs.writeFileSync('typescript/tests/unit/shared/errors/error-handler.test.ts', code)

// also patch error-logger test
code = fs.readFileSync('typescript/tests/unit/shared/errors/error-handler.test.ts', 'utf8')
code = code.replace("app.get('/generic-error', async () => {\n      throw new Error('Something went terribly wrong')\n    })", "let loggedError: any\n    app.log.error = (err) => {\n      loggedError = err\n    }\n\n    app.get('/generic-error', async () => {\n      throw new Error('Something went terribly wrong')\n    })")
code = code.replace("expect(response.json()).toEqual({\n      statusCode: 500,\n      error: 'Internal Server Error',\n      message: 'An unexpected error occurred',\n    })", "expect(response.json()).toEqual({\n      statusCode: 500,\n      error: 'Internal Server Error',\n      message: 'An unexpected error occurred',\n    })\n    expect(loggedError).toBeInstanceOf(Error)\n    expect(loggedError.message).toBe('Something went terribly wrong')")

fs.writeFileSync('typescript/tests/unit/shared/errors/error-handler.test.ts', code)
