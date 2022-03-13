import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Admin extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: ['customer']
  })
  roles?: string[];

  @property({
    type: 'Date',
    default: new Date()
  })
  createdAt?: Date

  @property({
    type: 'Date',
    default: new Date()
  })
  updatedAt?: Date

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  
}

export type AdminWithRelations = Admin & AdminRelations;
