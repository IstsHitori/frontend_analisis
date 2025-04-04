import {z} from "zod"

export const UserAuthSchema = z.object({
    _id: z.string(),
    name: z.string(),
    currentStudy: z.string(),
    educationalInstitution: z.string(),
    email: z.string().email(),
    role: z.enum(["admin", "estudiante"]),
    dateBirth: z.string(),
})