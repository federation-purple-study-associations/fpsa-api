import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, HttpCode, Body, Res, BadRequestException, Get } from '@nestjs/common';
import { LoginDTO } from '../../dto/user/login';
import { UserRepository } from '../../repositories/user.repository';
import { UserTransformer } from '../../transformers/user.transformer';
import * as bcrypt from 'bcrypt';
import { Me } from '../../decorators/me.decorator';
import { User } from '../../entities/user/user.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    @Get('me')
    @HttpCode(200)
    @ApiOperation({
        operationId: 'me',
        summary: 'getMe',
        description: 'This call can be used to get yourself',
    })
    @ApiResponse({ status: 200, description: 'Got ya!', type: User })
    @ApiResponse({ status: 401, description: 'Your are not logged in...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public getMe(@Me() me: Promise<User>): Promise<User> {
        return me;
    }

    @Post('login')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'Login',
        summary: 'login',
        description: 'This call can be used to gain access to the resources of FPSA, if you have the scopes for it',
    })
    @ApiResponse({ status: 202, description: 'Logged in!' })
    @ApiResponse({ status: 400, description: 'Email or password is incorrect...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async login(@Body() body: LoginDTO, @Res() response: any) {
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
}