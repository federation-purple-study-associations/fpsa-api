import { User } from '../entities/user/user.entity';
import { JwtPayload } from '../dto/user/jwt';
import * as jwt from 'jsonwebtoken';

export class UserTransformer {
    public static toJwtToken(user: User) {
        const jwtPayload: JwtPayload = {
            email: user.email,
            scopes: user.scopes.map((scope) => scope.scope),
        };
        
        return jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: '1d'});
    }

    public static hasScope(token: string, scope: string) {
        const decodeToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        return decodeToken.scopes.includes(scope);
    }
}