import { User } from '../entities/user/user.entity';
import { JwtPayload } from '../dto/user/jwt';
import * as jwt from 'jsonwebtoken';
import { UserSummaryDTO } from '../dto/user/user.summary';
import { UserNewDTO } from '../dto/user/user.new';
import { Role } from '../entities/user/role.entity';
import { UserUpdateDTO } from '../dto/user/user.update';

export class UserTransformer {
    public static toJwtToken(user: User) {
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            scopes: user.role.scopes.map((scope) => scope.scope),
        };
        
        return jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: '1d'});
    }

    public static toSummary(users: User[]) {
        const output: UserSummaryDTO[] = [];
        for (const user of users) {
            output.push({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
            });
        }

        return output;
    }

    public static toUser(dto: UserNewDTO, role: Role) {
        const user = new User();
        user.fullName = dto.fullName;
        user.email = dto.email;
        user.role = role;
        
        return user;
    }

    public static update(dto: UserUpdateDTO, user: User, role?: Role) {
        user.fullName = dto.fullName;
        user.email = dto.email;
        if (role) {
            user.role = role;
        }
        
        return user;
    }

    public static decodeJwt(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    public static hasScope(token: string, scope: string) {
        const decodeToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        return decodeToken.scopes.includes(scope);
    }
}