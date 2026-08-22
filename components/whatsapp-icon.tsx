import { siWhatsapp } from "simple-icons";

type WhatsAppIconProps = {
  className?: string;
  size?: number;
};

export function WhatsAppIcon({ className, size = 20 }: WhatsAppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={siWhatsapp.path} />
    </svg>
  );
}
