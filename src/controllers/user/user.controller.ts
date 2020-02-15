import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, HttpCode, Body, UnauthorizedException, Res } from '@nestjs/common';
import { LoginDTO } from '../../dto/user/login';
import { UserRepository } from '../../repositories/user.repository';
import { UserTransformer } from '../../transformers/user.transformer';
import * as bcrypt from 'bcrypt';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    @Post('login')
    @HttpCode(202)
    @ApiOperation({
        operationId: 'Login',
        summary: 'login',
        description: 'This call can be used to gain access to the resources of FPSA, if you have the scopes for it',
    })
    @ApiResponse({ status: 202, description: 'Logged in!' })
    @ApiResponse({ status: 401, description: 'Email or password is incorrect...' })
    @ApiResponse({ status: 500, description: 'Internal server error...' })
    public async login(@Body() body: LoginDTO, @Res() response: any) {
        const user = await this.userRepository.login(body.email);
        if (!user || !bcrypt.compare(body.password, user.password)) {
            throw new UnauthorizedException('Email or password is incorrect...');
        }

        const jwtToken = UserTransformer.toJwtToken(user);
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);

        response
            .setCookie('auth', jwtToken, process.env.env !== 'Testing' ? { domain: '.fpsa.nl', expires } : { expires })
            .send();
    }
}