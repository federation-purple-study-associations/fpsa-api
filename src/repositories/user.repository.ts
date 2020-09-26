import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { BaseEntity, IsNull, Not } from 'typeorm';
import { Role } from '../entities/user/role.entity';
import { Confirmation } from '../entities/user/confirmation.entity';
import { v4 as uuidv4 } from 'uuid';
import { Application } from '../entities/user/application.entity';

@Injectable()
export class UserRepository {
    public login(email: string): Promise<User> {
        return User.findOne({where: {email}, relations: ['role', 'role.scopes'], select: ['password', 'email', 'id']});
    }

    public getAll(): Promise<User[]> {
        return User.find({ relations: ['role'], order: { roleId: 'ASC' } });
    }

    public getAllMembers(): Promise<User[]> {
        return User.find({ where: {roleId: 2}, relations: ['activityPlans'] });
    }

    public getAllForExcelExport(): Promise<User[]> {
        return User.find({ where: {roleId: 2} });
    }

    public getAllWhoWantsEventNotification(): Promise<User[]> {
        return User.find({ where: {recieveEmailUpdatesEvents: true, password: Not(IsNull())} });
    }

    public getOne(id: number): Promise<User> {
        return User.findOne({ where: {id} });
    }

    public getOneByEmail(email: string): Promise<User> {
        return User.findOne({where: { email }});
    }

    public getConfirmation(token: string): Promise<Confirmation> {
        return Confirmation.findOne({where: {token}, relations: ['user', 'user.role', 'user.role.scopes']});
    }

    public getRole(id: number): Promise<Role> {
        return Role.findOne({ where: {id} });
    }

    public createConfirmation(user: User): Promise<Confirmation> {
        const confirmation = new Confirmation();
        confirmation.user = user;
        confirmation.token = uuidv4();

        return this.save(confirmation);
    }

    public getAllApplications(): Promise<Application[]> {
        return Application.find();
    }

    public getApplication(id: number): Promise<Application> {
        return Application.findOne({where: {id}});
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }

    public delete<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.remove();
    }
}
