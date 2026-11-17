'use client';

import { useState } from "react";
import Image from "next/image";
import { agregarProducto, eliminarProducto } from "../actions/productosactions";
import { createClient } from "../database/bd";


export default function 
InterfaceProducto({ productos, puedeEliminar }) {
    const [agregado, setAgregado] = useState(false);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [productosState, setProductosState] = useState(productos);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [panelAbierto, setPanelAbierto] = useState(true);
    const productosFiltrados = productosState.filter((producto) =>
        producto.nombre.toLocaleLowerCase("es").startsWith(busqueda.trim().toLocaleLowerCase("es"))
    );

    const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    setError("");
    setEliminandoId(id);

    try {
        await eliminarProducto(id);

        setProductosState((actuales) =>
            actuales.filter((producto) => producto.id !== id)
        );
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        setError("No se pudo eliminar el producto de la base de datos. Revisa los permisos de Supabase.");
    } finally {
        setEliminandoId(null);
    }
};

    const handleSubmit = async (e) => {
            e.preventDefault();
            if (guardando) return;
    
            const formulario = e.currentTarget;
            const archivo = formulario.elements.imagen.files[0];
            const nombreProducto = nombre.trim();
            const precioProducto = Number(precio);
            setError("");
            setAgregado(false);
    
            if (!nombreProducto || !Number.isFinite(precioProducto) || precioProducto <= 0) {
                setError("Escribe un nombre y un precio mayor que cero.");
                return;
            }
            if (archivo && !["image/png", "image/jpeg", "image/webp"].includes(archivo.type)) {
                setError("Selecciona una imagen PNG, JPG o WebP.");
                return;
            }
    
            setGuardando(true);
            let rutaImagen = null;
            let supabase = null;
            try {
                let imagen = "";
                if (archivo) {
                    supabase = createClient();
                    const extension = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[archivo.type];
                    rutaImagen = `productos/${crypto.randomUUID()}.${extension}`;
                    const { error: errorImagen } = await supabase.storage.from("imgs").upload(rutaImagen, archivo);
                    if (errorImagen) {
                        rutaImagen = null;
                        throw errorImagen;
                    }
                    imagen = supabase.storage.from("imgs").getPublicUrl(rutaImagen).data.publicUrl;
                }

                const nuevoProducto = await agregarProducto(nombreProducto, precioProducto, imagen, descripcion);
                setProductosState((actuales) => [...actuales, nuevoProducto]);
                setNombre("");
                setPrecio("");
                setDescripcion("");
                formulario.reset();
                setAgregado(true);
            } catch (error) {
                console.error("Error al agregar el producto:", error);
                if (rutaImagen && supabase) {
                    const { error: errorLimpieza } = await supabase.storage.from("imgs").remove([rutaImagen]);
                    if (errorLimpieza) console.error("No se pudo borrar la imagen subida:", errorLimpieza);
                }
                setError("No se pudo guardar el producto. Revisa la conexión y los permisos de Supabase.");
            } finally {
                setGuardando(false);
            }
        };
        return (
        <section className="min-h-screen -my-4 bg-black px-4 py-8 text-gray-100">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="inline-block border-b-2 border-indigo-500 pb-2 text-3xl font-bold tracking-wide uppercase">
                        Catálogo
                    </h2>
                </div>

                {error && <p role="alert" className="mb-4 text-sm text-red-300">{error}</p>}
                <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                <p className="mb-4 text-sm text-gray-400">{productosFiltrados.length} {productosFiltrados.length === 1 ? "producto" : "productos"}</p>
                {productosFiltrados.length === 0 && <p className="rounded-xl border border-gray-700 p-6 text-gray-300">No se encontraron productos.</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {productosFiltrados.map((item) => (
                        <div key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                            <details className="group">
                            <summary className="cursor-pointer list-none focus-visible:outline-2 focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
                            <div className="relative mb-4 flex h-64 items-center justify-center rounded-lg bg-gray-50">
                                {item.imagen ? (
                                    <Image src={item.imagen} alt={item.nombre} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" className="rounded-lg object-contain p-3" loading="eager" />
                                ) : (
                                    <span className="text-sm text-gray-500">Sin imagen</span>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold capitalize text-gray-900 truncate" title={item.nombre}>
                                {item.nombre}
                            </h3>
                            <p className="mt-2 text-2xl font-bold text-indigo-600">
                                ${item.precio.toFixed(2)}
                            </p>
                            <span className="mt-4 flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors group-hover:bg-indigo-100">
                                Detalles del producto <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                            </span>
                            </summary>
                            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{item.descripcion || "Este producto no tiene descripción."}</p>
                            </details>
                            {puedeEliminar && <button
                                type="button"
                                onClick={() => handleEliminar(item.id)}
                                disabled={eliminandoId === item.id}
                                className="mt-4 inline-flex items-center justify-center rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {eliminandoId === item.id ? "Eliminando..." : "Eliminar"}
                            </button>}
                        </div>
                    ))}
                </div>
                </div>

                <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-80">
                    <button type="button" onClick={() => setPanelAbierto(!panelAbierto)} aria-expanded={panelAbierto} aria-controls="panel-productos" className="flex w-full items-center justify-between rounded-xl border border-gray-700 bg-gray-900 px-5 py-4 text-left font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                        <span>Buscar y agregar</span>
                        <span aria-hidden="true">{panelAbierto ? "−" : "+"}</span>
                    </button>
                    <div id="panel-productos" hidden={!panelAbierto} className="mt-2 rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-lg lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                    <label htmlFor="buscar-producto" className="mb-2 block text-sm font-medium text-gray-200">Buscar producto</label>
                    <input id="buscar-producto" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Busca por nombre" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <p className="mt-2 text-xs text-gray-400">Escribe las primeras letras del producto.</p>
                <form onSubmit={handleSubmit} onChange={() => { setAgregado(false); setError(""); }} className="mt-6 space-y-5 border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold text-white">Agregar producto</h3>
                    <fieldset disabled={guardando} className="space-y-5">
                    <div>
                        <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-200">
                            Nombre del producto:
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            pattern=".*\S.*"
                            title="Escribe un nombre, no solamente espacios."
                            placeholder="Ej. Monitor"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-gray-200">
                            Descripción del producto (opcional):
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={3}
                            placeholder="Describe el producto"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="precio" className="mb-2 block text-sm font-medium text-gray-200">
                            Precio:
                        </label>
                        <input
                            id="precio"
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="Ej. 2500.00"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="imagen" className="mb-2 block text-sm font-medium text-gray-200">
                            Imagen del producto (opcional):
                        </label>
                        <input
                            id="imagen"
                            name="imagen"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-sm text-gray-200 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white focus-visible:outline-2 focus-visible:outline-indigo-400"
                        />
                        <p className="mt-2 text-sm text-gray-400">Selecciona una imagen PNG, JPG o WebP de tu computadora.</p>
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                        {guardando ? "Agregando..." : agregado ? "Producto agregado" : "Agregar producto"}
                    </button>
                    </fieldset>
                    <p role="status" className="text-sm text-indigo-300">{agregado ? "Producto agregado al catálogo." : ""}</p>
                </form>
                    </div>
                </aside>
                </div>
            </div>
        </section>
    );







}
