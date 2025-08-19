import { IconMessageCircle2 } from "@tabler/icons-react";
import { Flex } from "@mantine/core";
import { LanguageSelector } from "../i18n/LanguageSelector";

export const CustomTitle: React.FC = () => {
  return (
    <Flex justify="space-between" align="center" w="100%">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconMessageCircle2 size={24} color="#228be6" />
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
          Store Feedback
        </span>
      </div>
      <LanguageSelector />
    </Flex>
  );
};
