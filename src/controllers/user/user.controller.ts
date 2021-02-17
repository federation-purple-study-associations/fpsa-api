import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Controller, Post, HttpCode, Body, Res, BadRequestException, Get, Param, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { LoginDTO } from '../../dto/user/login';
import { UserRepository } from '../../repositories/user.repository';
import { UserTransformer } from '../../transformers/user.transformer';
import * as bcrypt from 'bcrypt';
import { Me } from '../../decorators/me.decorator';
import { User } from '../../entities/user/user.entity';
import { Auth } from '../../decorators/auth.decorator';
import { UserSummaryDTO } from '../../dto/user/user.summary';
import { UserNewDTO } from '../../dto/user/user.new';
import { UserUpdateDTO } from '../../dto/user/user.update';
import { Role } from '../../entities/user/role.entity';
import { EmailService } from '../../services/email/email.service';
import { UserActivateDTO } from '../../dto/user/user.activate';
import { NewApplication } from '../../dto/user/application.new';
import { Application } from '../../entities/user/application.entity';
import { UserForgotDTO } from '../../dto/user/user.forgot';
import { FastifyReply } from 'fastify';
import { ContactFormDTO } from '../../dto/user/contact.form';
import { ContactMembersDTO } from '../../dto/user/contact.members';
import { extname, resolve } from 'path';
import { createWriteStream, existsSync, mkdirSync, readFile, unlinkSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { MemberDTO } from '../../dto/user/user.members';
import * as mime from 'mime-types';
import { containsUpload } from '../../dto/file.interface';

@Controller('user')
@ApiTags('user')
export class UserController {
    private readonly photoUrl: string = resolve(process.env.STORAGE_PATH, 'user', 'photo');

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
    ) { }

    @Get('me')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'getMe',
        summary: 'getMe',
        description: 'This call can be used to get yourself',
    })
    @ApiResponse({ status: 200, description: 'Got ya!', type: User })
    @ApiResponse({ status: 401, description: 'You are not logged in...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public getMe(@Me() me: Promise<User>): Promise<User> {
        return me;
    }

    @Post('me')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'updateMe',
        summary: 'updateMe',
        description: 'This call can be used to update your own settings',
    })
    @ApiResponse({ status: 202, description: 'Updated you!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 401, description: 'Your are not logged in...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async updateMe(@Me() mePromise: Promise<User>, @Body() body: User) {
        this.userRepository.save(UserTransformer.updateMe(await mePromise, body));
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'Login',
        summary: 'login',
        description: 'This call can be used to gain access to the resources of FPSA, if you have the scopes for it',
    })
    @ApiResponse({ status: 200, description: 'Logged in!' })
    @ApiResponse({ status: 400, description: 'Email or password is incorrect...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async login(@Body() body: LoginDTO, @Res() response: FastifyReply): Promise<void> {
        const user = await this.userRepository.login(body.email);
        if (!user || !(await bcrypt.compare(body.password, user.password))) {
            throw new BadRequestException('Email or password is incorrect...');
        }

        user.lastLogin = new Date();
        this.userRepository.save(user);

        const jwtToken = UserTransformer.toJwtToken(user);
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        response
            .setCookie('auth', jwtToken, process.env.env !== 'Testing' ? { domain: '.fpsa.nl', expires, path: '/' } : { expires, path: '/' })
            .send();
    }

    @Post('activate')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'Activate',
        summary: 'activate',
        description: 'This call can be used to activate an account using a confirmation token',
    })
    @ApiResponse({ status: 200, description: 'Account activated!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 404, description: 'Token invalid...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async activate(@Body() body: UserActivateDTO, @Res() response: FastifyReply) {
        const confirmation = await this.userRepository.getConfirmation(body.token);
        if (!confirmation) {
            throw new NotFoundException('Token invalid...');
        }

        confirmation.user.password = await bcrypt.hash(body.password, 10);
        await Promise.all([
            this.userRepository.save(confirmation.user),
            this.userRepository.delete(confirmation),
        ]);

        const jwtToken = UserTransformer.toJwtToken(confirmation.user);
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        response
            .setCookie('auth', jwtToken, process.env.env !== 'Testing' ? { domain: '.fpsa.nl', expires, path: '/' } : { expires, path: '/' })
            .send();
    }

    @Get()
    @Auth('User:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'UserGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all of the users in the FPSA database',
    })
    @ApiResponse({ status: 200, description: 'Users', type: UserSummaryDTO, isArray: true })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getUsers(): Promise<UserSummaryDTO[]> {
        return UserTransformer.toSummary(await this.userRepository.getAll());
    }

    @Get('full')
    @Auth('User:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'UserGetAllFull',
        summary: 'getAllFull',
        description: 'This call can be used to get all of the users',
    })
    @ApiResponse({ status: 200, description: 'Users', type: User, isArray: true })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getFullUsers(): Promise<User[]> {
        return this.userRepository.getAllForExcelExport();
    }

    @Get('members')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'UserGetAllMembers',
        summary: 'getAllMembers',
        description: 'This call can be used to get all of the members of FPSA'
    })
    @ApiResponse({ status: 200, description: 'Members!', type: MemberDTO, isArray: true })
    public async getMembers(): Promise<MemberDTO[]> {
        return UserTransformer.toMember(await this.userRepository.getAllMembers(false));
    }

    @Get('photo')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'UserGetPhoto',
        summary: 'getPhoto',
        description: 'This call can be used to get the photo of the specific board',
    })
    @ApiResponse({ status: 200, description: 'Board photo' })
    @ApiResponse({ status: 404, description: 'This board is not found...' })
    public async getPicture(@Query('id') id: number, @Res() res: any): Promise<void>  {
        const item = await this.userRepository.getOne(id);
        if (!item) {
            throw new NotFoundException('This user is not found...');
        }

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.photoUrl, item.photoUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(item.photoUrl)).send(buffer);
    }

    @Get(':id')
    @Auth('User:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'UserGetOne',
        summary: 'getOne',
        description: 'This call can be used to get one of the users in the FPSA database',
    })
    @ApiResponse({ status: 200, description: 'User', type: User })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'User not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async getOneUser(@Param('id') id: number): Promise<User> {
        const user = await this.userRepository.getOne(id);
        if (!user) {
            throw new NotFoundException('User not found...');
        }

        return user;
    }

    @Post('forgot')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'UserForgot',
        summary: 'forgot',
        description: 'This call can be used to send a user an email in order to reset its password',
    })
    @ApiResponse({ status: 202, description: 'Email send!' })
    @ApiResponse({ status: 404, description: 'User not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async sendForgotEmail(@Body() body: UserForgotDTO): Promise<void> {
        const user: User = await this.userRepository.getOneByEmail(body.email);
        if (!user) {
            throw new NotFoundException('User not found...');
        }

        const confirmation = await this.userRepository.createConfirmation(user);
        this.emailService.sendForgotPasswordEmail(user, confirmation);
    }

    @Post()
    @Auth('User:Write')
    @ApiConsumes('multipart/form-data')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'UserCreate',
        summary: 'create',
        description: 'This call can be used to create a new user',
    })
    @ApiResponse({ status: 202, description: 'User created!' })
    @ApiResponse({ status: 400, description: 'Validation error or invalid role...' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async createUser(@Body() body: UserNewDTO) {
        if (!containsUpload(body.photo)) {
            throw new BadRequestException('Upload needs photo...');
        }

        const role = await this.userRepository.getRole(body.roleId);
        if (!role) {
            throw new BadRequestException('Invalid role...');
        }

        const user = await this.userRepository.save(UserTransformer.toUser(body, role));
        const confirmation = await this.userRepository.createConfirmation(user);

        // Create path if needed
        !existsSync(this.photoUrl) && mkdirSync(this.photoUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.photoUrl, user.photoUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.photo[0].data);
            stream.end();
        });

        this.emailService.sendRegistrationConfirmation(user, confirmation);
    }

    @Put(':id')
    @Auth('User:Write')
    @ApiConsumes('multipart/form-data')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'UserUpdate',
        summary: 'update',
        description: 'This call can be used to update a user',
    })
    @ApiResponse({ status: 202, description: 'User updated!' })
    @ApiResponse({ status: 400, description: 'Validation error or invalid role...' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'User not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async updateUser(@Body() body: UserUpdateDTO, @Param('id') id: number) {
        const user = await this.userRepository.getOne(id);
        if (!user) {
            throw new NotFoundException('User not found...');
        }

        // To increase performance only update role when the roleId does not match the roleId of the request body
        let role: Role;
        if (user.roleId !== body.roleId) {
            role = await this.userRepository.getRole(body.roleId);
            if (!role) {
                throw new BadRequestException('Invalid role...');
            }
        }

        let photoUrl = user.photoUrl;
        if (containsUpload(body.photo)) {
            // Create path if needed
            !existsSync(this.photoUrl) && mkdirSync(this.photoUrl, { recursive: true });

            // Delete old image to preserve storage space
            try {
                unlinkSync(resolve(this.photoUrl, photoUrl));
            } catch(e) {}

            // Update url name
            photoUrl = uuid() + extname(body.photo[0].filename);

            // Add new image
            const stream = createWriteStream(resolve(this.photoUrl, photoUrl), {encoding: 'binary'});
            stream.once('open', () => {
                stream.write(body.photo[0].data);
                stream.end();
            });
        }

        await this.userRepository.save(UserTransformer.update(body, user, photoUrl, role));
    }

    @Delete(':id')
    @Auth('User:Delete')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'UserDelete',
        summary: 'delete',
        description: 'This call can be used to delete a user',
    })
    @ApiResponse({ status: 202, description: 'User deleted!' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'User not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async deleteUser(@Param('id') id: number) {
        const user = await this.userRepository.getOne(id);
        if (!user) {
            throw new NotFoundException('User not found...');
        }

        unlinkSync(resolve(this.photoUrl, user.photoUrl));
        await this.userRepository.delete(user);
    }

    @Post('application')
    @HttpCode(202)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        operationId: 'ApplicationCreate',
        summary: 'create',
        description: 'This call can be used to create an application',
    })
    @ApiResponse({ status: 202, description: 'Application accepted!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async addApplication(@Body() body: NewApplication): Promise<void> {
        if (!containsUpload(body.photo)) {
            throw new BadRequestException('Upload needs photo...');
        }

        const application = await this.userRepository.save(UserTransformer.toApplication(body));

        // Create path if needed
        !existsSync(this.photoUrl) && mkdirSync(this.photoUrl, { recursive: true });

        const stream = createWriteStream(resolve(this.photoUrl, application.photoUrl), {encoding: 'binary'});
        stream.once('open', () => {
            stream.write(body.photo[0].data);
            stream.end();
        });

        await this.emailService.sendApplicationConfirmation(application);
        await this.emailService.sendApplicationToBoard(application);
    }

    @Get('application')
    @Auth('User:Read')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ApplicationGetAll',
        summary: 'getAll',
        description: 'This call can be used to get all applications',
    })
    @ApiResponse({ status: 200, description: 'Application accepted!', type: Application, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public getAllApplications(): Promise<Application[]> {
        return this.userRepository.getAllApplications();
    }

    @Post('application/:id/accept')
    @Auth('User:Write')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ApplicationAccept',
        summary: 'accept',
        description: 'This call can be used to accept an application',
    })
    @ApiResponse({ status: 200, description: 'Application accepted!' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'Application not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async acceptApplication(@Param('id') id: number): Promise<void> {
        const application = await this.userRepository.getApplication(id);
        if (!application) {
            throw new NotFoundException('Application could not be found...')
        }

        this.userRepository.delete(application);

        const user = await this.userRepository.save(UserTransformer.fromApplication(application));
        const confirmation = await this.userRepository.createConfirmation(user);

        await this.emailService.sendRegistrationConfirmation(user, confirmation);
        await this.emailService.sendApplicationAccepted(application);
    }

    @Post('application/:id/decline')
    @Auth('User:Write')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ApplicationDecline',
        summary: 'decline',
        description: 'This call can be used to decline an application',
    })
    @ApiResponse({ status: 202, description: 'Application declined!' })
    @ApiResponse({ status: 403, description: 'You do not have the permission to perform this action...' })
    @ApiResponse({ status: 404, description: 'Application not found...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async declineApplication(@Param('id') id: number): Promise<void> {
        const application = await this.userRepository.getApplication(id);
        if (!application) {
            throw new NotFoundException('Application could not be found...')
        }

        unlinkSync(resolve(this.photoUrl, application.photoUrl));
        await this.userRepository.delete(application);
        await this.emailService.sendApplicationDeclined(application);
    }

    @Get('application/photo')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ApplicationGetPhoto',
        summary: 'getPhoto',
        description: 'This call can be used to get the photo of the specific application',
    })
    @ApiResponse({ status: 200, description: 'Application photo' })
    @ApiResponse({ status: 404, description: 'This application is not found...' })
    public async getApplicationPicture(@Query('id') id: number, @Res() res: any): Promise<void>  {
        const item = await this.userRepository.getApplication(id);
        if (!item) {
            throw new NotFoundException('This application is not found...');
        }

        const buffer = await new Promise<Buffer>((Resolve) => readFile(resolve(this.photoUrl, item.photoUrl), (err, data) => Resolve(data)));
        res.type(mime.lookup(item.photoUrl)).send(buffer);
    }

    @Post('contact')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'Contact',
        summary: 'contact',
        description: 'This call can be used to send an email to info@fpsa.nl',
    })
    @ApiResponse({ status: 200, description: 'Contact form has been send!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async sendContactEmail(@Body() body: ContactFormDTO): Promise<void> {
        await this.emailService.sendContactEmail(body);
    }

    @Post('contact/members')
    @Auth('User:Write')
    @ApiConsumes('multipart/form-data')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'ContactMembers',
        summary: 'contactMembers',
        description: 'This call can be used to send an email to all of the members',
    })
    @ApiResponse({ status: 200, description: 'Contact email has been send!' })
    @ApiResponse({ status: 400, description: 'Validation error...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async contactMembers(@Body() body: ContactMembersDTO): Promise<void> {
        const members: User[] = await this.userRepository.getAllMembers(false);

        body.message = body.message.replace(/(?:\r\n|\r|\n)/g, '<br>');
        await this.emailService.sendContactMembersEmail(body, members);
    }
}