// 🐛 BUG 3 : signature incorrecte — Express détecte un middleware d'erreur
// uniquement si la fonction a exactement 4 paramètres : (err, req, res, next)
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({ error: message });
};