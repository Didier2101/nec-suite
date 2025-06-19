"use client"

import { useCustomForm } from "@/hooks/useCustomForm";
import { LoginFormData, loginSchema } from "@/src/schemas/loginSchema";
import { FormButton } from "@/src/ui/FormButton";
import { FormInput } from "@/src/ui/FormInput";
import Logo from "@/src/ui/Logo";
import { ArrowRight, Lock, Mail, } from "lucide-react"
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";



export default function FormLogin() {

    const router = useRouter()

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useCustomForm<LoginFormData>({
        schema: loginSchema,
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            Swal.fire({
                title: "Iniciando sesión...",
                text: "Por favor espere...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });



            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Para manejar cookies
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('resultado del login', result)


            if (!response.ok) {
                throw new Error(result.error || "Error al iniciar sesión");
            }

            // ✅ Verificar respuesta exitosa
            if (!result.ok) {
                throw new Error(result.error || result.message || "Error en autenticación");
            }

            // 🎉 Éxito - redirección basada en rol
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: result.message || "Inicio de sesión exitoso",
                timer: 1500,
                showConfirmButton: false,
            });

            setTimeout(() => {
                const userRole = result.user?.role || result.rol;
                router.push(userRole === "ADMIN" ? '/admin' : '/dashboard');
            }, 1500);

        } catch (error) {
            console.error("Login error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    };
    return (
        <div className="flex  items-center justify-center mt-20 ">
            {/* Contenedor principal con fondo y espaciado */}
            <div className="w-full max-w-[400px] space-y-8 bg-white p-8 rounded-xl shadow-lg bg-gray-100">
                {/* Logo y Título */}
                <div className="flex items-center flex-col gap-3">
                    <Logo width={200} height={160} />
                    <h2 className=" text-lg font-extrabold text-blue-800 mt-4">
                        Sign in to your account
                    </h2>
                </div>

                {/* Formulario de inicio de sesión */}
                <form className=" space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">

                        {/* Campo de email */}
                        <FormInput
                            label=" Email address"
                            name="email"
                            type="email"
                            register={register}
                            error={errors.email}
                            placeholder="tucorreo@ejemplo.com"
                            icon={Mail}
                            required
                        />

                        {/* Campo de contraseña */}
                        <FormInput
                            label="password"
                            name="password"
                            type="text"
                            register={register}
                            error={errors.password}
                            placeholder="tucorreo@ejemplo.com"
                            icon={Lock}
                            showPasswordToggle
                            required
                        />


                    </div>

                    {/* Botón de envío */}
                    <div>
                        <FormButton
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={isSubmitting}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full"
                        >
                            Sign in
                        </FormButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
