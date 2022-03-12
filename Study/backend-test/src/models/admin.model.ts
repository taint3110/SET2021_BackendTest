import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Admin extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  
}

export type AdminWithRelations = Admin & AdminRelations;
