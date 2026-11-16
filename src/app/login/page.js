"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { iniciarSesion } from "../actions/loginactions";


export default function LoginPage() {
  const [aviso, setAviso] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
  event.preventDefault();
  setAviso("");

  const formulario = new FormData(event.currentTarget);
  const correo = formulario.get("correo");
  const contrasena = formulario.get("contrasena");

  try {
    const resultado = await iniciarSesion(correo, contrasena);

    if (resultado.error) {
      setAviso(resultado.error);
      return;
    }

    router.push("/");
    router.refresh();
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    setAviso("Ocurrió un error. Inténtalo de nuevo.");
  }
}

  return (
    <section className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa tus datos para acceder a tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Entrar
          </button>
          {aviso && <p role="status" className="text-center text-sm text-gray-600">{aviso}</p>}
        </form>
      </div>
    </section>
  );
}
