"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../database/sv";

export async function agregarcomentario(correo, motivo, mensaje) {
    if (![correo, motivo, mensaje].every((valor) => typeof valor === "string" && valor.trim())) {
        throw new Error("Completa todos los campos.");
    }
    const bd = await createClient();
    const { error } = await bd
        .from("comentario")
        .insert({ correo: correo.trim(), motivo: motivo.trim(), mensaje: mensaje.trim() });
    if (error) {
        console.error("Error al guardar el comentario:", error.message);
        throw new Error("Error al agregar el comentario.");
    }
    revalidatePath("/contacto");
}
