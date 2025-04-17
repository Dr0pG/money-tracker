import i18n from "@/i18n";

export const getLanguages = () => {
  return [
    {
      label: i18n.t("english"),
      value: "en",
    },
    {
      label: i18n.t("portuguese"),
      value: "pt",
    },
    {
      label: i18n.t("french"),
      value: "fr",
    },
  ];
};
