import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {Customer} from '../models';
import {Credentials, CustomerRepository} from '../repositories/customer.repository';
import {BcryptHasher} from './hash.password';

export class MyCustomerService implements UserService<Customer, Credentials>{
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher

  ) {}
  async verifyCredentials(credentials: Credentials): Promise<Customer> {
    // implement this method
    const foundCustomer = await this.customerRepository.findOne({
      where: {
        email: credentials.email
      }
    });
    if (!foundCustomer) {
      throw new HttpErrors.NotFound('customer not found');
    }
    const passwordMatched = await this.hasher.comparePassword(credentials.password, foundCustomer.password)
    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('password is not valid');
    return foundCustomer;
  }
  convertToUserProfile(customer: Customer): UserProfile {
    return {
      [securityId]: customer.id!.toString(),
      id: customer.id,
      email: customer.email
    };
    // throw new Error('Method not implemented.');
  }

}