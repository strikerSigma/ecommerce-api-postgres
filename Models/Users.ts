import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient() //Single instance of PrismaClient

//optional interface declaration
// interface UserInt {
//     id?: string,
//     name: string,
//     email: string,
//     password: string
// }

