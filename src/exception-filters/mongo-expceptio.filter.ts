import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

import * as MongooseError from 'mongoose/lib/error';

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    let error;

    switch (exception.name) {
      case 'DocumentNotFoundError': {
        error = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        };
        break;
      }
      // case 'MongooseError': { break; } // general Mongoose error
      // case 'CastError': { break; }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      // case 'ValidatorError': { break; }
      // case 'ValidationError': { break; }
      // case 'ObjectExpectedError': { break; }
      // case 'ObjectParameterError': { break; }
      // case 'OverwriteModelError': { break; }
      // case 'ParallelSaveError': { break; }
      // case 'StrictModeError': { break; }
      // case 'VersionError': { break; }
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'EERRRORORORORRO',
        };
        break;
      }
    }

    response.status(error.statusCode).json(error);
  }
}

// @Catch(MongooseError)
// export class MongoExceptionFilter implements ExceptionFilter {
//   catch(exception: MongoError, host: ArgumentsHost) {
//     console.log('ERROR');
//     switch (exception.code) {
//       case 11000:
//       // duplicate exception
//       // do whatever you want here, for instance send error to client
//     }
//   }
// }
