import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    idUsuario: number;
    nombreUsuario: string;
    rol: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const secretKey = process.env.JWT_SECRET || "";

  try {
    const decoded: any = jwt.verify(token, secretKey) as{
      idUsuario: number;
      nombreUsuario: string;
      rol: string;
    };

    req.user = {
      idUsuario: decoded.idUsuario,
      nombreUsuario: decoded.nombreUsuario,
      rol: decoded.rol,
    };

    console.log("Usuario autenticado correctamente:", req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};
