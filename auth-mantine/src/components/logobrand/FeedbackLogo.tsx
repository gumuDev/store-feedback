export const FeedbackLogo: React.FC = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img 
        src="/logo_pippo_pizza.png" 
        alt="Pippo Pizza Logo" 
        style={{ 
          height: "120px", 
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))"
        }} 
      />
    </div>
  );
};