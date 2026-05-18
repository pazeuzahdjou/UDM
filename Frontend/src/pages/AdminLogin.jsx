// Frontend/src/pages/AdminLogin.jsx
export default function AdminLogin() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#166534", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "20px",
        textAlign: "center"
      }}>
        <h1>🔐 Page Admin Login</h1>
        <p>Si vous voyez ce message, le composant fonctionne !</p>
        <p>Email: admin@univ-moundou.td</p>
        <p>Mot de passe: Admin123456</p>
      </div>
    </div>
  );
}