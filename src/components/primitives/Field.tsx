import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "focus-ring w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy placeholder:text-slate/60 transition-colors focus:border-orange";

export function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-navy">
      {children}
      {required ? <span className="text-orange"> *</span> : null}
    </label>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-red-600">
      {children}
    </p>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClasses, "min-h-32 resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn(fieldClasses, "appearance-none bg-no-repeat", className)} {...props}>
      {children}
    </select>
  );
}
