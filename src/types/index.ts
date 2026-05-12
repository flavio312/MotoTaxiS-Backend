import { Request } from 'express';
export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  fileName: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  tags?: string[];
  transformation?: any[];
}

export interface CloudinaryDeleteResult {
  success: boolean;
  result: string;
}
export interface Usuario {
  idUsuario?: number;
  nombreUsuario: string;
  password: string;
  rol: 'pasajero' | 'conductor' | 'admin' | 'propietario';
  estadoCuenta: 'activo' | 'suspendido' | 'eliminado';
  fechaRegistro?: Date;
  fotoPerfil?: string;
}

export interface UsuarioCreateRequest {
  nombreUsuario: string;
  password: string;
  rol: 'pasajero' | 'conductor' | 'admin' | 'propietario';
  estadoCuenta: 'activo' | 'suspendido' | 'eliminado';
}

export interface UsuarioUpdateRequest extends Partial<UsuarioCreateRequest> {}

// Extender Request de Express para incluir file y files
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

// Respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface UsuarioResponse {
  idUsuario: number;
  nombreUsuario: string;
  rol: string;
  imagen: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

// Configuración de Cloudinary
export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
} 