
import {
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  getJsonSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Agency} from '../models';
import {AgencyRepository} from '../repositories';
import {agencyRoutes} from './routes.helper'
import {authorize} from '@loopback/authorization';
export class AgencyController {
  constructor(
    @repository(AgencyRepository)
    public agencyRepository : AgencyRepository,
  ) {}

  @get(agencyRoutes.readProduct)
  @response(200, {
    description: 'Admin read data of agency',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agency, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Agency, {exclude: 'where'}) filter?: FilterExcludingWhere<Agency>
  ){
    let product = {}
    await this.agencyRepository.findById(id, filter).then(agency => {
      if(agency.product !== undefined){
        product = agency.product
      }
    })
    return product
  }

  @patch(agencyRoutes.createProduct)
  @response(204, {
    description: 'Agency create product',
  })
  async createProduct(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {partial: true}),
        },
      },
    })
    agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.updateById(id, agency);
  }

  @patch(agencyRoutes.updateProduct)
  @response(204, {
    description: 'Agency update product',
  })
  async updateProduct(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {partial: true}),
        },
      },
    })
    agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.updateById(id, agency);
  }

  @patch(agencyRoutes.updateProduct)
  @response(204, {
    description: 'Agency delete product',
  })
  async deleteProduct(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {partial: true}),
        },
      },
    })
    agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.updateById(id, agency);
  }

  @get(agencyRoutes.readTransaction)
  @response(200, {
    description: 'Admin read transaction of owner product',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agency, {includeRelations: true}),
      },
    },
  })
  async readTransaction(
    @param.path.string('id') id: string,
    @param.filter(Agency, {exclude: 'where'}) filter?: FilterExcludingWhere<Agency>
  ){
    let transaction = {}
    await this.agencyRepository.findById(id, filter).then(agency => {
      if(agency.transaction !== undefined){
        transaction = agency.transaction
      }
    })
    return transaction
  }

  @get(agencyRoutes.readBilling)
  @response(200, {
    description: 'Admin read billing of owner product',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agency, {includeRelations: true}),
      },
    },
  })
  async readBilling(
    @param.path.string('id') id: string,
    @param.filter(Agency, {exclude: 'where'}) filter?: FilterExcludingWhere<Agency>
  ){
    let billing = {}
    await this.agencyRepository.findById(id, filter).then(agency => {
      if(agency.billing !== undefined){
        billing = agency.billing
      }
    })
    return billing
  }

}
