import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['ADMIN', 'USER']),
});

export type UserFormData = z.infer<typeof userSchema>;