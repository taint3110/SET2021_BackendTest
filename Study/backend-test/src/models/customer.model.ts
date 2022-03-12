import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Customer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    index: {
      unique: true
    }
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
    type: 'string',
  })
  cart?: string;

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

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
}

export type CustomerWithRelations = Customer & CustomerRelations;
