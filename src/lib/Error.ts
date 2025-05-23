export class ApiExceedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiExceedError";
    }
}