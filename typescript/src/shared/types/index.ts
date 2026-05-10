import '@fastify/jwt'

declare module 'fastify' {
  interface FastifyContextConfig {
    public?: boolean
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      email: string
    }
  }
}

export * from './user.types.js'
