export interface Servicios{
    idServicio: number;
    idPasajero: number;
    idConductor: number;
    idVehiculo: number;
    idTipoServicio: number;

    idDireccionOrigen: number;
    idDireccionDestino: number;

    fechaSolicitud: Date;
    fechaInicio: Date;
    fechaFin: Date;

    distancia: number;
    estado: 'solicitado' | 'aceptado' | 'en_curso' | 'completado' | 'cancelado';
}

export interface TipoServicio{
    idTipoServicio: number;
    nombre: string;
    descripcion: string;
}