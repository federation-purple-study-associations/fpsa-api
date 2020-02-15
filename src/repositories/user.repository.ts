import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.entity';

@Injectable()
export class UserRepository {
    public login(email: string): Promise<User> {
        return User.findOne({where: {email}, relations: ['scopes'], select: ['password', 'email', 'id']});
    }
}
