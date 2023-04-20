import { useTranslation } from "react-i18next";

export function SharedComponent() {
  const { t } = useTranslation("shared.banking");
  return <>{t("SharedComponent.fromShared")}</>;
}
