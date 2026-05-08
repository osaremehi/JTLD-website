// server/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

/**
 * Express middleware factory: validate req.body against a Zod schema.
 * Attaches parsed data to req.body (replaces raw input with validated types).
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: err.errors.map(e => ({
              field: e.path.join('.'),
              issue: e.message,
            })),
          },
        })
        return
      }
      next(err)
    }
  }
}
