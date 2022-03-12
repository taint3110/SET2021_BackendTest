// Uncomment these imports to begin using these cool features!
import {get} from '@loopback/rest';
// import {inject} from '@loopback/core';


export class HelloController {
  constructor() {}
  async sayHello(): Promise<string> {
    console.log('yes');
    return 'Hello world';
  }
}
