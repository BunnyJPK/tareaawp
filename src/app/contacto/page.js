'use client';

import { useState } from "react";
import { agregarcomentario } from "../actions/contactoactions";




export default function ContactoPage() {
  const contacto = [
    {
      id: 1,
      nombre: "Tienda",
      Email: "tienda@example.com",
      telefono: "1234567890",
    },
    {
      id: 2,
      nombre: "Soporte",  
      Email: "soporte@example.com",
      telefono: "0987654321",
    },
    {
      id: 3,
      nombre: "Ventas",
      Email: "ventas@example.com",
      telefono: "1111111111",
    },
    {
      id: 4,
      nombre: "Atención al Cliente",
      Email: "atencioncliente@example.com",
      telefono: "2222222222",
    },
    {
      id: 5,
      nombre: "Marketing",
      Email: "marketing@example.com",
      telefono: "3333333333",
    },
    {
      id: 6,
      nombre: "Recursos Humanos",
      Email: "recursoshumanos@example.com",
      telefono: "4444444444",
    },
    {
      id: 7,
      nombre: "Finanzas",
      Email: "finanzas@example.com",
      telefono: "5555555555",
    },
  ];

  const [correo, setCorreo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState(""); 
  const [enviando, setEnviando] = useState(false);



 const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);

    try {
      await agregarcomentario(correo, motivo, mensaje);

      window.alert("Mensaje enviado correctamente.");
      setCorreo("");
      setMotivo("");
      setMensaje("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      window.alert("Error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };


  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Título de los contactos wasaaaaa */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-300 tracking-wide uppercase border-b-2 border-indigo-500 pb-2 inline-block"> Contacto directo wasaaa </h2>
      </div>

      {/* Aqui van los inputs o algo asi */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-250">
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg bg-gray-400 px-4 py-3 text-gray-900 border border-whit focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-250">
            Motivo de contacto
          </label>
          <input
            type="text"
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg bg-gray-400 px-4 py-3 text-gray-900 border border-whit focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-250">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg bg-gray-400 px-4 py-3 text-gray-900 border border-whit focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>



      
      {/* Tarjetas de contactos */}  
    
      {/* Título de los contactos wasaaaaa */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-300 tracking-wide uppercase border-b-2 border-indigo-500 pb-2 inline-block">
          Todos los contactos wasaaa
        </h2>
      </div>    
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacto.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2 border-gray-100">
                {item.nombre}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    Email:
                  </span>

                  <a
                    href={`mailto:${item.Email}`}
                    className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors truncate"
                  >
                    {item.Email}
                  </a>
                </p>

                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    Teléfono:
                  </span>

                  <a
                    href={`tel:${item.telefono}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {item.telefono}
                  </a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
