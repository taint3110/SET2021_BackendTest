import { Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { get, getJsonSchemaRef, post, param, getModelSchemaRef, requestBody, response } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import * as _ from 'lodash';
import { PasswordHasherBindings, TokenServiceBindings, CustomerServiceBindings } from '../keys';
import { Customer } from '../models';
import { Credentials, CustomerRepository } from '../repositories';
import { validateCredentials } from '../services';
import { BcryptHasher } from '../services/hash.password';
import { JWTService } from '../services/jwt-service';
import { MyCustomerService } from '../services/customer-service';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { customerRoutes } from './routes.helper'

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    @inject(CustomerServiceBindings.CUSTOMER_SERVICE)
    public customerService: MyCustomerService,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,

  ) {}

  @post(customerRoutes.signup, {
    responses: {
      '200': {
        description: 'Customer sign up',
        content: {
          schema: getJsonSchemaRef(Customer)
        }
      }
    }
  })
  async signup(@requestBody() customerData: Customer) {
    await validateCredentials(_.pick(customerData, ['email', 'password']), this.customerRepository);
    customerData.password = await this.hasher.hashPassword(customerData.password)
    const savedCustomer = await this.customerRepository.create(customerData);
    return savedCustomer;
  }

  @post(customerRoutes.login, {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    // make sure customer exist,password should be valid
    const customer = await this.customerService.verifyCredentials(credentials);
    // console.log(customer);
    const customerProfile = await this.customerService.convertToUserProfile(customer);
    // console.log(customerProfile);

    const token = await this.jwtService.generateToken(customerProfile);
    return Promise.resolve({token: token})
  }


  @authenticate("jwt")
  @get(customerRoutes.getMe, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current customer profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(Customer),
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentCustomer: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentCustomer);
  }

  @get(customerRoutes.readTransaction)
  @response(200, {
    description: 'Admin read transaction of owner product',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async readTransaction(
    @param.path.string('id') id: string,
    @param.filter(Customer, {exclude: 'where'}) filter?: FilterExcludingWhere<Customer>
  ){
    let transaction = {}
    await this.customerRepository.findById(id, filter).then(agency => {
      if(agency.transaction !== undefined){
        transaction = agency.transaction
      }
    })
    return transaction
  }

  @get(customerRoutes.readBilling)
  @response(200, {
    description: 'Admin read billing of owner product',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async readBilling(
    @param.path.string('id') id: string,
    @param.filter(Customer, {exclude: 'where'}) filter?: FilterExcludingWhere<Customer>
  ){
    let billing = {}
    await this.customerRepository.findById(id, filter).then(agency => {
      if(agency.billing !== undefined){
        billing = agency.billing
        console.log(billing)
      }
    })
    return billing
  }

}
