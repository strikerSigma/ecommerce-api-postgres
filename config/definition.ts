import { Request } from "express"
export interface AuthInfoRequest extends Request {
  user: string // or any other type
}