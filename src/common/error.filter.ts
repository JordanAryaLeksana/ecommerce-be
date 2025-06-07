import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { ZodError } from "zod";
import { Response } from 'express';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(ErrorFilter.name);
    
    catch(exception: unknown, host: ArgumentsHost) {

        const response = host.switchToHttp().getResponse<Response>()

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json({
                errors: exception.getResponse()
            });
        } else if (exception instanceof ZodError) {
            this.logger.error(
                `ZodError: ${JSON.stringify(exception.errors, null, 2)}`
            );
          
            
            response.status(400).json({
                errors: `Validation Error: ${exception.errors.map(err => err.message).join(', ')}`
            });
        } else {
            response.status(500).json({
                errors: exception instanceof Error ? exception.message : 'Unknown error'
            });
        }
    }
}
