"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const EVENT_TYPES = [
  "Boda",
  "Retrato",
  "Evento deportivo",
  "Evento corporativo",
  "Cumpleaños",
  "Otro",
];

type FormState = {
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  email: "",
  eventType: "",
  eventDate: "",
  message: "",
};

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Ingresa tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un email válido.";
  }
  if (!values.eventType) errors.eventType = "Selecciona un tipo de evento.";
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = "Contanos un poco más (mínimo 10 caracteres).";
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-sand";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium tracking-wide text-ink uppercase">
            Nombre
          </label>
          <input
            className={inputClass}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Tu nombre completo"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium tracking-wide text-ink uppercase">
            Email
          </label>
          <input
            type="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tu@email.com"
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium tracking-wide text-ink uppercase">
            Tipo de evento
          </label>
          <select
            className={inputClass}
            value={values.eventType}
            onChange={(e) => update("eventType", e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.eventType && (
            <p className="mt-1.5 text-xs text-red-600">{errors.eventType}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium tracking-wide text-ink uppercase">
            Fecha estimada
          </label>
          <input
            type="date"
            className={inputClass}
            value={values.eventDate}
            onChange={(e) => update("eventDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-ink uppercase">
          Mensaje
        </label>
        <textarea
          rows={5}
          className={inputClass}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Contanos sobre tu evento, ubicación y todo lo que tengas en mente..."
        />
        {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Enviar mensaje
      </button>

      {status === "success" && (
        <p className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          ¡Gracias! Tu mensaje fue enviado, te responderé a la brevedad.
        </p>
      )}
      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          Ocurrió un error al enviar el mensaje. Intenta nuevamente.
        </p>
      )}
    </form>
  );
}
