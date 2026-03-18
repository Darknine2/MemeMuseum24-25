import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { AuthService } from "../_services/auth-service/auth-service";

const excludedDomains = ['http://localhost:3000/auth/login', 'http://localhost:3000/auth/register'];

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (excludedDomains.some(domain => request.url.includes(domain))) {
        return next(request);
    }

    if (token) {
        // Clone the request and add the Authorization header with the token
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
    }

    return next(request);
}