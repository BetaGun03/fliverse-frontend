import { Content } from "./content";

export interface List {
    id           ?: number;
    name          : string;
    description  ?: string;
    contents     ?: Content[];  //
    creation_date?: Date;
}