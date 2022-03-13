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
import {Admin} from '../models';
import {Agency} from '../models';
import {AdminRepository, AgencyRepository, Credentials} from '../repositories';
import {validateCredentialsAgency} from '../services'
import {PasswordHasherBindings} from '../keys'
import {BcryptHasher} from '../services/hash.password';
export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository : AdminRepository,
    @repository(AgencyRepository)
    public agencyRepository : AgencyRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

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
  async createAgency(@requestBody() agencyData: Agency) {
    await validateCredentialsAgency(_.pick(agencyData, ['email', 'password']), this.agencyRepository);
    agencyData.password = await this.hasher.hashPassword(agencyData.password)
    const savedAgency = await this.agencyRepository.create(agencyData);
    return savedAgency;
  }

  @patch(adminRoutes.updateAgency)
  @response(204, {
    description: 'Agency PATCH success',
  })
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
    await this.agencyRepository.updateById(id, agency);
  }

  @del(adminRoutes.deleteAgency)
  @response(204, {
    description: 'Agency DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.agencyRepository.deleteById(id);
  }
}
