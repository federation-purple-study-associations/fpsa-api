import { User } from '../entities/user/user.entity';
import { JwtPayload } from '../dto/user/jwt';
import * as jwt from 'jsonwebtoken';

export class UserTransformer {
    public static toJwtToken(user: User) {
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            scopes: user.scopes.map((scope) => scope.scope),
        };
        
        return jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: '1d'});
    }

    public static decodeJwt(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    public static hasScope(token: string, scope: string) {
        const decodeToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        return decodeToken.scopes.includes(scope);
    }
}