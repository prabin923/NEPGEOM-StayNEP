import type { InputHTMLAttributes, ReactNode } from "react";

const inputClassName =
  "w-full rounded-[14px] border border-fog bg-snow px-4 py-3 text-sm text-ink outline-none transition placeholder:text-steel/60 focus:border-obsidian focus:ring-2 focus:ring-obsidian/10";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
}

export function AuthField({ label, hint, id, className = "", ...props }: AuthFieldProps) {
  const fieldId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-obsidian font-cosmica">
        {label}
      </label>
      <input
        id={fieldId}
        className={`${inputClassName} ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-steel font-cosmica">{hint}</p>}
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-[14px] border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-800 font-cosmica"
    >
      {message}
    </p>
  );
}

export function AuthSubmitButton({
  children,
  pending,
  pendingLabel,
}: {
  children: ReactNode;
  pending: boolean;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[36px] bg-obsidian py-3.5 text-sm font-semibold text-snow shadow-button transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 font-cosmica"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="text-center text-sm text-steel font-cosmica">
      {text}{" "}
      <a href={href} className="font-semibold text-obsidian hover:underline">
        {linkText}
      </a>
    </p>
  );
}
