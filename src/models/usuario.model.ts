
export interface Usuario {
  idUsuario?:     number;
  nombreUsuario:  string;
  password_hash:  string;
  rol:            'pasajero' | 'conductor' | 'admin' | 'propietario';
  estadoCuenta:   'activo' | 'suspendido' | 'eliminado';
  fechaRegistro?: Date;
  fotoPerfil?:    string;
}
