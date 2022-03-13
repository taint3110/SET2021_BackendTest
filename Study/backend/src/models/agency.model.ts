import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Agency extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
    default: "",
  })
  name: string;

  @property({
    type: 'string',
    required: false,
    default: "",
  })
  address: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  
  password: string;

  @property({
    type: 'string',
    required: false,
    default: ""
  })
  phoneNumber: string;

  @property({
    type: 'string',
    default: "Male",
  })
  gender?: string;

  @property({
    type: 'object',
    default: {},
  })
  product?: object;
  

  @property({
    type: 'array',
    itemType: 'object',
    default: [],
  })
  transaction?: object[];

  @property({
    type: 'array',
    itemType: 'object',
    default: [],
  })
  billing?: object[];

  constructor(data?: Partial<Agency>) {
    super(data);
  }
}

export interface AgencyRelations {
  
}

export type AgencyWithRelations = Agency & AgencyRelations;
