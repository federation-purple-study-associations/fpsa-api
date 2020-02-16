import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { BaseEntity } from 'typeorm';

@Injectable()
export class UserRepository {
    public login(email: string): Promise<User> {
        return User.findOne({where: {email}, relations: ['scopes'], select: ['password', 'email', 'id']});
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }
}
