import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { AuthService } from "../_services/auth-service/auth-service";
import { GlobalBackendService } from "../_services/backend/global-backend-service/global-backend-service";

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const globalBackend = inject(GlobalBackendService);
    const excludedDomains = [
        globalBackend.getPathBackend('auth/login'), 
        globalBackend.getPathBackend('auth/register')
    ];
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