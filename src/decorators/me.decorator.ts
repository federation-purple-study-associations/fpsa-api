import { createParamDecorator, UnauthorizedException } from "@nestjs/common";
import { User } from '../entities/user/user.entity';
import { UserTransformer } from '../transformers/user.transformer';

const errorNoAuthCookieFound = 'No authorization cookie has been found... Please make sure that you are logged in before performing this action';

export const Me = createParamDecorator(async (data: any, request: any): Promise<User> => {
    if (!request.headers.cookie) {
        throw new UnauthorizedException(errorNoAuthCookieFound);
    }
    const list: any = {};
    const rc = request.headers.cookie;
    if (rc) {
        rc.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }

    const auth = list.auth;
    if (!auth) {
        throw new UnauthorizedException(errorNoAuthCookieFound);
    }

    const id = UserTransformer.decodeJwt(auth).id;
    return User.findOne({where: {id}});
});
