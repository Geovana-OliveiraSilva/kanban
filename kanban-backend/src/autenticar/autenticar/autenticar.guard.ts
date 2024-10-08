import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface PayloadRequest extends Request {
  usuario: {
    email: string;
    id: number;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this._extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Acesso não autorizado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.usuario = payload;
    } catch (error) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return true;
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return undefined;
    }
    return authHeader.split(' ')[1];
  }
}
