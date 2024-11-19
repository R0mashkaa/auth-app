import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '@app/modules/repository';
import { DRIZZLE_ORM } from '@app/common/constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@app/schemas';
import { CreateUserDto, UpdateMeDto } from '@app/modules/users';
import { eq } from 'drizzle-orm';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let drizzle: jest.Mocked<PostgresJsDatabase<typeof schema>>;

  beforeEach(async () => {
    drizzle = {
      insert: jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ insertedId: '1' }]),
        }),
      }),
      update: jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ updatedId: '1' }]),
          }),
        }),
      }),
      delete: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          execute: jest.fn().mockResolvedValue(undefined),
        }),
      }),
      query: {
        users: {
          findMany: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue([mockUser]),
          }),
          findFirst: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue(mockUser),
          }),
        },
      },
    } as unknown as jest.Mocked<PostgresJsDatabase<typeof schema>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: DRIZZLE_ORM,
          useValue: drizzle,
        },
      ],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    password: 'hashed-password',
  };

  describe('Positive Cases', () => {
    it('[200]-should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await usersRepository.create(createUserDto);

      expect(drizzle.insert).toHaveBeenCalledWith(schema.users);
      expect(result).toEqual(mockUser);
    });

    it('[200]-should return all users', async () => {
      const result = await usersRepository.findAll();

      expect(drizzle.query.users.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('[200]-should return a user by id', async () => {
      const result = await usersRepository.findById('1');

      expect(drizzle.query.users.findFirst).toHaveBeenCalledWith({
        where: eq(schema.users.id, '1'),
      });
      expect(result).toEqual(mockUser);
    });

    it('[200]-should return a user by email', async () => {
      const result = await usersRepository.findByEmail('test@example.com');

      expect(drizzle.query.users.findFirst).toHaveBeenCalledWith({
        where: eq(schema.users.email, 'test@example.com'),
      });
      expect(result).toEqual(mockUser);
    });

    it('[200]-should update a user by id', async () => {
      const test: UpdateMeDto = {
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
      };

      await usersRepository.updateById('1', test);

      expect(drizzle.update).toHaveBeenCalledWith(schema.users);
    });

    it('[200]-should delete a user by id', async () => {
      const result = await usersRepository.deleteById('1');

      expect(drizzle.delete).toHaveBeenCalledWith(schema.users);
      expect(result).toBeUndefined();
    });
  });
});
