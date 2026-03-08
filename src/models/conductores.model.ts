export interface Conductor {
    idConductor: number;
    licencia: string;
    licenciaFechaExpedicion: Date;
    licenciaFechaVencimiento: Date;
}

export interface ConductorCambioEstatus{
    idCambio: number;
    idConductor: number;
    estatus: 'habilitado' | 'deshabilitado';
    descripcion: string;
    fecha: Date;
}

export interface ConductorJornada{
    idJornada: number;
    idConductor: number;
    fecha: Date;
    horaInicio: Date;
    horaFin: Date;
}

