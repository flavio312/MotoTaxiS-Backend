export interface Usuario {
  idUsuario?:     number;
  nombreUsuario:  string;
  password:  string;
  rol:            'pasajero' | 'conductor' | 'admin' | 'propietario';
  estadoCuenta:   'activo' | 'suspendido' | 'eliminado';
  fechaRegistro?: Date;
  fotoPerfil?:    string;
}
