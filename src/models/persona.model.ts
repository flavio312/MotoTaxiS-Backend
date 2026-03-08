export interface Persona {
    idPersona?: number;
    nombre: string;
    apellidoP: string;
    apellidoM: string;
    idSexo: number;
    correoElectronico: string;
    telefono: string;
    fechaNacimiento: Date;
}

export interface PersonaConSexo extends Persona {
    sexo: string;
}