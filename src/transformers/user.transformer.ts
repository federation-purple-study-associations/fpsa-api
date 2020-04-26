import { User } from '../entities/user/user.entity';
import { JwtPayload } from '../dto/user/jwt';
import * as jwt from 'jsonwebtoken';
import { UserSummaryDTO } from '../dto/user/user.summary';
import { UserNewDTO } from '../dto/user/user.new';
import { Role } from '../entities/user/role.entity';
import { UserUpdateDTO } from '../dto/user/user.update';
import { Application } from '../entities/user/application.entity';
import { NewApplication } from '../dto/user/application.new';

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
        user.academy = dto.academy;
        user.role = role;
        user.kvk = dto.kvk;
        user.establishment = dto.establishment;
        
        return user;
    }

    public static update(dto: UserUpdateDTO, user: User, role?: Role) {
        user.fullName = dto.fullName;
        user.email = dto.email;
        user.academy = dto.academy;
        user.kvk = dto.kvk;
        user.establishment = dto.establishment;

        if (role) {
            user.role = role;
        }
        
        return user;
    }

    public static updateMe(me: User, update: User) {
        me.email = update.email;
        me.recieveEmailUpdatesEvents = update.recieveEmailUpdatesEvents;

        return me;
    }

    public static decodeJwt(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    public static hasScope(token: string, scope: string) {
        const decodeToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        return decodeToken.scopes.includes(scope);
    }

    public static fromApplication(application: Application): User {
        const user = new User();
        user.email = application.email;
        user.fullName = application.name;
        user.academy = application.academy;
        user.kvk = application.kvk;
        user.establishment = application.establishment;
        
        user.roleId = 2;

        return user;
    }

    public static toApplication(body: NewApplication) {
        const application = new Application();
        application.email = body.email;
        application.name = UserTransformer.checkName(body.name);
        application.academy = body.academy;
        application.kvk = body.kvk;
        application.establishment = body.establishment;

        return application;
    }

    /**
     * This function will make sure that the name of a study association will be forced to: s.v. {NAME}, if it isn't
     * @param name Name of study association
     */
    private static checkName(name: string): string {
        if (name.substr(0, 5) === 's.v. ') {
            return name;
        
        } else if (name.substr(0, 3) === 'sv ' || name.substr(0, 4) === 's.v ' || name.substr(0, 4) === 'sv. ') {
            return 's.v. ' + name.substring(3);
        
        } else {
            return 's.v. ' + name;
        }
    }
}
