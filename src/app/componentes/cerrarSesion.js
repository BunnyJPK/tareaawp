"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cerrarSesion } from "../actions/loginactions";

export default function CerrarSesion() {
  const [aviso, setAviso] = useState("");
  const [cerrando, setCerrando] = useState(false);
  const router = useRouter();

  async function handleCerrarSesion() {
    setAviso("");
    setCerrando(true);

    try {
      const resultado = await cerrarSesion();
      if (resultado.error) {
        setAviso(resultado.error);
        return;
      }
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setAviso("No se pudo cerrar sesión. Inténtalo de nuevo.");
    } finally {
      setCerrando(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCerrarSesion}
        disabled={cerrando}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
      >
        {cerrando ? "CERRANDO..." : "CERRAR SESIÓN"}
      </button>
      {aviso && <p role="alert" className="text-sm text-red-700">{aviso}</p>}
    </div>
  );
}
