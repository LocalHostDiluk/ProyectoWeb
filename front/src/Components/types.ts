export interface Mensaje {
  id: string;
  remitenteId?: string;
  destinatarioNombre?: string;
  destinatarioId?: string;
  asunto: string;
  contenido: string;
  leido?: boolean;
  ver?: boolean;
  fecha: {
    _seconds: number;
    _nanoseconds: number;
  };
  remitenteNombre?: string;
}
