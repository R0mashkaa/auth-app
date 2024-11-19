import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '@app/modules/users/users.service';
import { UsersRepository } from '@app/modules/repository';
import { RedisService } from '@app/modules/redis';
import { CreateUserDto } from '@app/modules/users/dto';
import { RolesEnum } from '@app/modules/users/enums';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updateById: jest.fn(),
            queryUpdateById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    redisService = module.get(RedisService);
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
    it('[200]-should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      usersRepository.create.mockResolvedValue(mockUser);

      const result = await usersService.create(createUserDto);

      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('[200]-should return all users (cached)', async () => {
      const cachedUsers = [mockUser];
      redisService.get.mockResolvedValue(JSON.stringify(cachedUsers));

      const result = await usersService.findAll();

      expect(redisService.get).toHaveBeenCalledWith('all_users');
      expect(result).toEqual(cachedUsers);
    });

    it('[200]-should return all users (non-cached)', async () => {
      redisService.get.mockResolvedValue(null);
      usersRepository.findAll.mockResolvedValue([mockUser]);

      const result = await usersService.findAll();

      expect(usersRepository.findAll).toHaveBeenCalled();
      expect(redisService.set).toHaveBeenCalledWith('all_users', JSON.stringify([mockUser]), 3600);
      expect(result).toEqual([mockUser]);
    });

    it('[200]-should return a user by id', async () => {
      redisService.get.mockResolvedValue(null);
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await usersService.findById('1');

      expect(usersRepository.findById).toHaveBeenCalledWith('1');
      expect(redisService.set).toHaveBeenCalledWith('user_1', JSON.stringify(mockUser), 3600);
      expect(result).toEqual(mockUser);
    });

    it('[200]-should update a user by id', async () => {
      const updateMeDto = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
        role: RolesEnum.USER,
      };

      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.updateById.mockResolvedValue({ ...mockUser, ...updateMeDto });

      const result = await usersService.updateById('1', updateMeDto);

      expect(usersRepository.updateById).toHaveBeenCalledWith('1', updateMeDto);
      expect(result).toEqual({ ...mockUser, ...updateMeDto });
    });

    it('[200]-should delete a user by id', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.deleteById.mockResolvedValue(null);

      await usersService.deleteById('1');

      expect(usersRepository.deleteById).toHaveBeenCalledWith('1');
    });

    it('[200]-should update user role', async () => {
      const adminId = '1';
      const userId = '2';
      const role = RolesEnum.ADMIN;

      usersRepository.queryUpdateById.mockResolvedValue({ ...mockUser, id: userId, role });

      const result = await usersService.roleUpdate(adminId, userId, role);

      expect(usersRepository.queryUpdateById).toHaveBeenCalledWith(userId, { role });
      expect(result).toEqual({ ...mockUser, id: userId, role });
    });
  });

  describe('Negative Cases', () => {
    it('[404]-should throw an error when user not found by id', async () => {
      redisService.get.mockResolvedValue(null);
      usersRepository.findById.mockResolvedValue(null);

      await expect(usersService.findById('1')).rejects.toThrow(BadRequestException);
    });

    it('[404]-should throw an error when deleting a non-existent user', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(usersService.deleteById('1')).rejects.toThrow(BadRequestException);
    });

    it('[400]-should throw an error when admin tries to change own role', async () => {
      const adminId = '1';
      const userId = '1';
      const role = RolesEnum.ADMIN;

      await expect(usersService.roleUpdate(adminId, userId, role)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('[400]-should throw an error when creating a user fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      usersRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(usersService.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('[400]-should throw an error when updating a user fails', async () => {
      const updateMeDto = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
        role: RolesEnum.USER,
      };

      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.updateById.mockRejectedValue(new Error('Database error'));

      await expect(usersService.updateById('1', updateMeDto)).rejects.toThrow(BadRequestException);
    });
  });
});
