/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService)
  });

  describe('POST /api/users/', () => {
    beforeEach(async () => {
      await testService.deleteUser()
    })
    it("shoud be rejected id request is invalid", async() => {
      const response = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        name: "test",
        email: "test@gmail.com",
        password: "test"
      });

      logger.info(response.body)
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
      expect(response.body.data.name).toBe("test")
      expect(response.body.data.email).toBe("test@gmail.com")
      })
    })

  describe('POST /api/users/register', () => {
    beforeEach(async () => {
      
    })
    it("shoud be rejected id request is invalid", async() => {
      const response = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        name: "test",
        email: "test@gmail.com",
        password: "test"
      });

      logger.info(response.body)
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
      expect(response.body.data.name).toBe("test")
      expect(response.body.data.email).toBe("test@gmail.com")
      })
    })
    it("shoud be rejected if username already exist", async() => {
      await testService.createUser()
      const response = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        name: "test",
        email: "test@gmail.com",
        password: "test"
      });

      logger.info(response.body)
      expect(response.status).toBe(401)
      expect(response.body.errors).toBeDefined()
      })
    
    describe('POST /api/users/login', () => {
      beforeEach(async () => {
        await testService.deleteUser()
        await testService.createUser()
      })
      it("shoud be rejected if email already exist", async()=>{
        const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: "test@gmail.com",
          password: "test"
      })
      logger.info(response.body)
      expect(response.status).toBe(400)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.name).toBe("test")
      expect(response.body.data.email).toBe("test@gmail.com")
      expect(response.body.data.token).toBeDefined()
      expect(response.body.data.token.accessToken).toBeDefined()
      expect(response.body.data.token.refreshToken).toBeDefined()
    })
    
    describe('GET /api/users/current', () => {
      beforeEach(async () => {
        await testService.deleteUser()
        await testService.createUser()
      })

      it("shoud be rejected if username already exist", async() => {
      const response = await request(app.getHttpServer())
      .get('/api/users/current')
      .set('Authorization', 'wrong')
      logger.info(response.body)
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
      })

      it("shoud be rejected if username already exist", async() => {
        await testService.createUser()
        const response = await request(app.getHttpServer())
        .post('/api/users/current')
        .set("Authorization", "test")
  
        logger.info(response.body)
        expect(response.status).toBe(200)
        expect(response.body.errors).toBeDefined()
    })
  })  
});
})