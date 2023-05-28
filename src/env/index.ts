import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['develoment', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.string().default('3333'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Variaveis de ambiente inválida.', _env.error.format())
  throw new Error('Variaveis de ambiente inválida.')
}

export const env = _env.data
