import { useTranslation } from "@/i18n/service";

const footerLinks = ["Privacidad", "Términos", "Twitter"];

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer
      className="shrink-0"
      style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between px-12 py-4">
        <span
          className="text-[11px]"
          style={{
            color: "#a0a09c",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {t("home.footer", { year: new Date().getFullYear() })}
        </span>
        <div className="flex gap-5">
          {footerLinks.map((label) => (
            <span
              key={label}
              className="text-[11px]"
              style={{ color: "#a0a09c" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
