export interface Direccion {
    idDireccion : number;
    idAsentamiento : number;
    numeroExterior : string;
    numeroInterior : string | null;
    codigoPostal : string;
    latitud : number;
    longitud : number;
}
export interface DireccionCompleta {
    idDireccion: number;
    asentamiento: string;
    municipio: string;
    entidad: string;
    zona: string;
    tipoAsentamiento: string;
    numeroExt: string;
    numeroInt: string;
    codigoPostal: string;
    latitud: number;
    longitud: number;
}