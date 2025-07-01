"use client"

import { useForm } from "react-hook-form"
import { FormButton } from "@/src/ui/FormButton"
import { FormInput } from "@/src/ui/FormInput"
import { ArrowLeft, Mail } from "lucide-react"
import Swal from "sweetalert2"
import Link from "next/link"

export default function PasswordRecoveryForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: { email: string }) => {
        console.log("Datos enviados:", data)
        // try {
        //   Swal.fire({
        //     title: "Procesando solicitud",
        //     text: "Por favor espere...",
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //       Swal.showLoading()
        //     },
        //   })

        //   const response = await fetch("/api/auth/recovery", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data),
        //   })

        //   const result = await response.json()

        //   if (!response.ok) {
        //     throw new Error(result.error || "Error al procesar la solicitud")
        //   }

        //   Swal.fire({
        //     icon: "success",
        //     title: "¡Éxito!",
        //     text: result.message || "Se ha enviado un correo con las instrucciones",
        //     timer: 3000,
        //     showConfirmButton: false,
        //   })
        // } catch (error) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Error",
        //     text: error instanceof Error ? error.message : "Error desconocido",
        //   })
        // }
    }

    return (
        <div className="flex items-center justify-center ">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <Link
                    href="/"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver al inicio
                </Link>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa tu correo electrónico para recibir instrucciones
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <FormInput
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            register={register}
                            error={errors.email}
                            placeholder="tu@correo.com"
                            icon={Mail}
                            required

                        />
                    </div>

                    <div>
                        <FormButton
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={isSubmitting}
                            className="w-full"
                        >
                            Enviar instrucciones
                        </FormButton>
                    </div>
                </form>
            </div>
        </div>
    )
}