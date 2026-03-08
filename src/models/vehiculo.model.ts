
export interface Vehiculo {
    idVehiculo : number;
    inmatriculacion : string;
    idModelo : number;
    fechaAdquisicion : Date;
}

export interface VehiculoModelo{
    idVehiculo : number;
    descripcion : string;
}

export interface VehiculoEstatus{
    idEstado : number;
    idVehiculo : number;
    estatus : 'activo' | 'inactivo';
    fechaInicio : Date;
    fechaFin : Date | null;
    descripcion : string;
}

export interface PropietarioVehiculo{
    idPropietario : number;
    idVehiculo : number;
    fechaInicio : Date;
    fechaFin : Date | null;
}
