import { User } from '../entities/user/user.entity';
import { JwtPayload } from '../dto/user/jwt';
import * as jwt from 'jsonwebtoken';
import { UserSummaryDTO } from '../dto/user/user.summary';
import { UserNewDTO } from '../dto/user/user.new';
import { Role } from '../entities/user/role.entity';
import { UserUpdateDTO } from '../dto/user/user.update';
import { Application } from '../entities/user/application.entity';
import { NewApplication } from '../dto/user/application.new';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { MemberDTO } from '../dto/user/user.members';
import { Nationality } from '../entities/user/nationality.enum';

export class UserTransformer {
    public static toJwtToken(user: User): string {
        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            scopes: user.role.scopes.map((scope) => scope.scope),
        };
        
        return jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: '1d'});
    }

    public static toSummary(users: User[]): UserSummaryDTO[] {
        const output: UserSummaryDTO[] = [];
        for (const user of users) {
            output.push({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                boardTransfer: user.boardTransfer,
                isSleeping: user.isSleeping,
            });
        }

        return output;
    }

    public static toUser(dto: UserNewDTO, role: Role): User {
        const user = new User();
        user.fullName = dto.fullName;
        user.email = dto.email;
        user.academy = dto.academy;
        user.role = role;
        user.kvk = dto.kvk;
        user.establishment = dto.establishment;
        user.memberSince = new Date();
        user.websiteUrl = dto.websiteUrl;
        user.photoUrl = uuid() + extname(dto.photo[0].filename);
        user.recieveEmailUpdatesEvents = true;
        user.boardTransfer = dto.boardTransfer ?? '';
        user.isSleeping = false;
        user.nationality = dto.nationality;
        
        return user;
    }

    public static update(dto: UserUpdateDTO, user: User, photoUrl: string, role?: Role): User {
        user.fullName = dto.fullName;
        user.email = dto.email;
        user.academy = dto.academy;
        user.kvk = dto.kvk;
        user.establishment = dto.establishment;
        user.photoUrl = photoUrl;
        user.websiteUrl = dto.websiteUrl;
        user.boardTransfer = dto.boardTransfer;
        user.nationality = dto.nationality;

        // Because the request is form-data, we need to transform the string to a boolean
        user.isSleeping = dto.isSleeping == 'true';

        if (role) {
            user.role = role;
        }
        
        return user;
    }

    public static updateMe(me: User, update: User): User {
        me.email = update.email;
        me.recieveEmailUpdatesEvents = update.recieveEmailUpdatesEvents;

        return me;
    }

    public static decodeJwt(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    public static hasScope(token: string, scope: string): boolean {
        const decodeToken: JwtPayload = this.decodeJwt(token);
        return decodeToken.scopes.includes(scope);
    }

    public static fromApplication(application: Application): User {
        const user = new User();
        user.email = application.email;
        user.fullName = application.name;
        user.academy = application.academy;
        user.kvk = application.kvk;
        user.establishment = application.establishment;
        user.memberSince = new Date();
        user.recieveEmailUpdatesEvents = true;
        user.roleId = 2;
        user.photoUrl = application.photoUrl;
        user.websiteUrl = application.websiteUrl;
        user.nationality = Nationality.DUTCH;
        
        return user;
    }

    public static toApplication(body: NewApplication): Application {
        const application = new Application();
        application.email = body.email;
        application.name = body.name;
        application.academy = body.academy;
        application.kvk = body.kvk;
        application.establishment = body.establishment;
        application.handedIn = new Date();
        application.websiteUrl = body.websiteUrl;
        application.photoUrl = uuid() + extname(body.photo[0].filename);

        return application;
    }

    public static toMember(users: User[]): MemberDTO[] {
        return users.map(x => new MemberDTO(x.id, x.fullName, x.websiteUrl));
    }

}
