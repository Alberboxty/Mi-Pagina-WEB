import type { TokenPayload } from '../models/usuarios.model';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export {}


