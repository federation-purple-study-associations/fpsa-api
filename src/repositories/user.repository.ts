import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { BaseEntity } from 'typeorm';
import { Role } from '../entities/user/role.entity';

@Injectable()
export class UserRepository {
    public login(email: string): Promise<User> {
        return User.findOne({where: {email}, relations: ['scopes'], select: ['password', 'email', 'id']});
    }

    public getAll(): Promise<User[]> {
        return User.find();
    }

    public getOne(id: number): Promise<User> {
        return User.findOne({ where: {id} });
    }

    public getRole(id: number): Promise<Role> {
        return Role.findOne({ where: {id} });
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }

    public delete<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.remove();
    }
}
