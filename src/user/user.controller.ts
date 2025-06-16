import { Body, Controller, HttpCode, Post, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { LoginRequest, RegisterUserRequest, UserResponse } from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
// import { http } from 'winston';
// import { request } from 'http';
import { AccessTokenAuth } from '../common/Accesstoken.auth.guard';
import { Public } from '../common/public.decorator';
import { Tokens } from '../model/user.model';
@Controller('/api/users')
export class UserController  {
  constructor(private userService: UserService,
    // private AuthService: AuthService
  ){}
  
  @Post('/register')
  @Public()
  @HttpCode(200)
  async register(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>> { 
    const result = await this.userService.register(request)
    // console.log("controller",result)
    return {
      data: result
    }
  }

  @Post('/refresh-token')
  @Public()
  @HttpCode(200)
  async refreshToken(@Body() token: Tokens): Promise<WebResponse<Tokens>> {
    if (!token.id || !token.refreshToken) {
      return {
        error: 'Missing user id or refresh token'
      };
    }
    console.log("masuk",token)
    const result = await this.userService.refreshTokens(token.id, token.refreshToken);
    return {
      data: result,
    }
  }
  @Post('/login')
  @Public()
  @HttpCode(200)
  async login(@Body() request: LoginRequest): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request)
  
    console.log("controller",result)
    if(result.error){
      return {
        error: result.error
      }
    }
    if(result.data){
      console.log("controller",result.data) 
      return {
        data: result.data,
      }
    }
    return {
      error: "Unexpected response from login service"
    }
  }
  @Get('/current')
  @UseGuards(AccessTokenAuth)
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user)
    // console.log("masuk",result)
    return {
      data: result
    }
  }
  
  
}
