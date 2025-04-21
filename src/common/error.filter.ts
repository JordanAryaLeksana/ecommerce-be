import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ZodError } from "zod";
import { Response } from 'express';

@Catch(ZodError, HttpException) 
export class ErrorFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost){
        const response = host.switchToHttp().getResponse<Response>()

        if(exception instanceof HttpException){
            response.status(exception.getStatus()).json({
                errors: exception.getResponse()
            });
        } else if(exception instanceof ZodError){
            response.status(400).json({
                errors: "validation Error",    
        });
        } else {
        response.status(500).json({
            errors: exception instanceof Error ? exception.message : 'Unknown error'
        });
    }
}
}
