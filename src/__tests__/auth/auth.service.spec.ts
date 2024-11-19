import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@app/modules/auth/auth.service';
import { UsersRepository } from '@app/modules/repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto, PasswordUpdate } from '@app/modules/auth';
import { RolesEnum } from '@app/modules/users/enums';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            queryUpdateById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: RolesEnum.USER,
    password: 'hashed-password',
  };

  describe('Positive Cases', () => {
    it('[200]-should sign in a user', async () => {
      const signInDto: SignInDto = { email: 'test@example.com', password: 'password' };

      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('fake-jwt-token');

      const result = await authService.signIn(signInDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockUser,
        access_token: 'fake-jwt-token',
      });
    });

    it('[200]-should sign up a user', async () => {
      const signUpDto: SignUpDto = {
        email: 'newuser@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };

      usersRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      usersRepository.create.mockResolvedValue({ ...mockUser, email: 'newuser@example.com' });
      jwtService.sign.mockReturnValue('fake-jwt-token');

      const result = await authService.signUp(signUpDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...signUpDto,
        password: 'hashed-password',
      });
      expect(result).toEqual({
        ...mockUser,
        email: 'newuser@example.com',
        access_token: 'fake-jwt-token',
      });
    });

    it('[200]-should change the user password', async () => {
      const passwordUpdate: PasswordUpdate = {
        previousPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      };

      usersRepository.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      jwtService.sign.mockReturnValue('new-access-token');

      const result = await authService.changePassword(passwordUpdate, '1');

      expect(usersRepository.findById).toHaveBeenCalledWith('1');
      expect(usersRepository.queryUpdateById).toHaveBeenCalledWith('1', {
        password: 'new-hashed-password',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: 'new-access-token' });
    });
  });

  describe('Negative Cases', () => {
    it('[404]-should throw an error if user not found during sign in', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      const signInDto: SignInDto = { email: 'notfound@example.com', password: 'password' };

      await expect(authService.signIn(signInDto)).rejects.toThrow(BadRequestException);
    });

    it('[400]-should throw an error if password is incorrect during sign in', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const signInDto: SignInDto = { email: 'test@example.com', password: 'wrongpassword' };

      await expect(authService.signIn(signInDto)).rejects.toThrow(BadRequestException);
    });

    it('[400]-should throw an error if user already exists during sign up', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      await expect(authService.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });

    it('[404]-should throw an error if user not found during verification', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(authService.verify('999')).rejects.toThrow(BadRequestException);
    });
  });
});
