import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class ErrorFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
