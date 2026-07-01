import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // Check both x-auth-token and Authorization: Bearer <token> headers
    let token = req.header("x-auth-token");
    
    if (!token) {
      // Check Authorization header
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7, authHeader.length); // Remove "Bearer "
      }
    }
    
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
