import React from "react";
import { Select } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <Select
      data={[
        { value: 'es', label: t('language.spanish') },
        { value: 'en', label: t('language.english') }
      ]}
      value={i18n.language}
      onChange={(value) => value && changeLanguage(value)}
      w={140}
      size="sm"
    />
  );
};