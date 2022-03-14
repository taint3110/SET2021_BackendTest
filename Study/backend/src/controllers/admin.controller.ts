import * as _ from 'lodash';
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
import {inject} from '@loopback/core';
import {adminRoutes} from "./routes.helper"
import {Admin, Agency, Customer} from '../models';
import {AdminRepository, AgencyRepository, CustomerRepository, Credentials} from '../repositories';
import {validateCredentialsAgency, validateCredentials} from '../services'
import {PasswordHasherBindings} from '../keys'
import {BcryptHasher} from '../services/hash.password';
import {basicAuthorization} from '../services/basic.authorizor';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository : AdminRepository,
    @repository(AgencyRepository)
    public agencyRepository : AgencyRepository,
    @repository(CustomerRepository)
    public customerRepository : CustomerRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  // authorization
  @post(adminRoutes.createAdmin, {
    responses: {
      '200': {
        description: 'create, authorize admin',
        content: {'application/json': {schema: getModelSchemaRef(Customer)}},
      },
    },
  })
  async createAdmin(@requestBody() admin: Customer) {
    validateCredentials(_.pick(admin, ['email', 'password']), this.customerRepository);
    admin.roles = ["admin"]

    admin.password = await this.hasher.hashPassword(admin.password);
    const savedAdmin = await this.customerRepository.create(admin);
    return savedAdmin;
  }


  @get(adminRoutes.readAgency)
  @response(200, {
    description: 'Admin read data of agency',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Agency, {exclude: 'where'}) filter?: FilterExcludingWhere<Agency>
  ): Promise<Agency> {
    return this.agencyRepository.findById(id, filter);
  }

  @post(adminRoutes.createAgency, {
    responses: {
      '200': {
        description: 'Admin create Agency',
        content: {
          schema: getJsonSchemaRef(Agency)
        }
      }
    }
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async createAgency(@requestBody() agencyData: Agency) {
    await validateCredentialsAgency(_.pick(agencyData, ['email', 'password']), this.agencyRepository);
    agencyData.password = await this.hasher.hashPassword(agencyData.password)
    const savedAgency = await this.agencyRepository.create(agencyData);
    savedAgency.password = "******"
    return savedAgency;
  }

  @patch(adminRoutes.updateAgency)
  @response(204, {
    description: 'Agency PATCH success',
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async updateById(
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
    agency.updatedAt = new Date()
    await this.agencyRepository.updateById(id, agency);
  }

  @del(adminRoutes.deleteAgency)
  @response(204, {
    description: 'Agency DELETE success',
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.agencyRepository.deleteById(id);
  }

  @get(adminRoutes.readTransaction)
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

  @get(adminRoutes.readBilling)
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
        console.log(billing)
      }
    })
    return billing
  }
}
