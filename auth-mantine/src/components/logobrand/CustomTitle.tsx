import { IconMessageCircle2 } from "@tabler/icons-react";

export const CustomTitle: React.FC = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <IconMessageCircle2 size={24} color="#228be6" />
      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
        Store Feedback
      </span>
    </div>
  );
};
