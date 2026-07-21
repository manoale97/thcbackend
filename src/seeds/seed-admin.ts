import { UsersRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dto/createUser.dto';

export async function seedAdmin() {
  const repo = new UsersRepository();

  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const email = process.env.ADMIN_EMAIL ?? 'admin@local.com';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin12345!';

  // check existing by email
  const existing = await repo.findByEmailWithPassword(email);
  if (existing) {
    return;
  }

  const adminDto: CreateUserDto = {
    username,
    email,
    password,
    firstName: 'Admin',
    lastName: 'User',
    status: 1,
    role: 'admin',
  } as CreateUserDto;

  await repo.create(adminDto);
}

export default seedAdmin;
