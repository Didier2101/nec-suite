// src/components/admin/UserForm.tsx
'use client';

import { useCustomForm } from '@/hooks/useCustomForm';
import { Mail, Key, UserCheck, Shield, User } from 'lucide-react';
import ErrorInput from '@/src/ui/ErrorInput';
import { UserFormData, userSchema } from '@/src/schemas/userSchemas';
import { FormInput } from '@/src/ui/FormInput';
import { FormButton } from '@/src/ui/FormButton';

interface UserFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: UserFormData;
}

export default function UserForm({ onClose, onSuccess, initialData }: UserFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useCustomForm<UserFormData>({
        schema: userSchema,
        defaultValues: initialData || {
            name: '',
            username: '',
            email: '',
            password: '',
            role: 'USER',
        },
    });

    const onSubmit = async (data: UserFormData) => {
        console.log(data)
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Nombre Completo"
                        name="name"
                        register={register}
                        error={errors.name}
                        placeholder="Ej: Juan Pérez"
                        icon={User}
                        required
                    />

                    <FormInput
                        label="Nombre de Usuario"
                        name="username"
                        register={register}
                        error={errors.username}
                        placeholder="Ej: juan.perez"
                        icon={UserCheck}
                        required
                    />

                    <FormInput
                        label="Correo Electrónico"
                        name="email"
                        register={register}
                        error={errors.email}
                        placeholder="Ej: juan@example.com"
                        type="email"
                        icon={Mail}
                        required
                    />

                    {!initialData && (
                        <FormInput
                            label="Contraseña"
                            name="password"
                            register={register}
                            error={errors.password}
                            placeholder="********"
                            type="password"
                            icon={Key}
                            showPasswordToggle
                            required
                        />
                    )}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Shield size={18} className="text-gray-400" />
                            Rol
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("role")}
                            className={`
                                w-full pl-10 pr-4 py-3 rounded-lg border 
                                focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                                transition-colors
                                ${errors.role ? 'border-red-500' : 'border-gray-100'}
                            `}
                        >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                        {errors.role && <ErrorInput error={errors.role} />}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <FormButton
                            type="button"
                            size="md"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                        >
                            Cancelar
                        </FormButton>
                        <FormButton
                            type="submit"
                            size="md"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {initialData ? 'Actualizar' : 'Registrar'}
                        </FormButton>
                    </div>
                </form>
            </div>
        </div>
    );
}