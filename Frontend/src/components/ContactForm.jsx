import { useState }
from "react";

import {
  envoyerMessage
}
from "../services/api";

export default function ContactForm() {

  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: ""
  });

  async function submit(e) {

    e.preventDefault();

    const result =
      await envoyerMessage(form);

    alert(result.message);

    setForm({
      nom: "",
      email: "",
      message: ""
    });
  }

  return (

    <form
      onSubmit={submit}
      className="
      bg-white
      shadow-xl
      rounded-2xl
      p-10
      space-y-6
      "
    >

      <input
        type="text"
        placeholder="Nom"
        value={form.nom}

        onChange={(e)=>
          setForm({
            ...form,
            nom:e.target.value
          })
        }

        className="
        w-full
        border
        p-4
        rounded-xl
        "
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}

        onChange={(e)=>
          setForm({
            ...form,
            email:e.target.value
          })
        }

        className="
        w-full
        border
        p-4
        rounded-xl
        "
      />

      <textarea
        placeholder="Message"

        value={form.message}

        onChange={(e)=>
          setForm({
            ...form,
            message:e.target.value
          })
        }

        className="
        w-full
        border
        p-4
        rounded-xl
        h-40
        "
      />

      <button
        className="
        bg-blue-900
        text-white
        px-10
        py-4
        rounded-xl
        "
      >

        Envoyer

      </button>

    </form>
  );
}