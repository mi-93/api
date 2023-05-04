import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGeneralDto } from './dto/create-general.dto';
import { UpdateGeneralDto } from './dto/update-general.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class GeneralService {
  async createSuperAdmin() {
    try {
      return await admin
        .auth()
        .createUser({
          email: 'mmazhariqbal93@gmail.com',
          emailVerified: true,
          password: 'Maz!23456',
          displayName: 'MI',
        })
        .then((user) => {
          admin.auth().setCustomUserClaims(user.uid, { SA: true });
          return { status: 0, message: 'Super Admin Created Successfully' };
        })
        .catch((error) => {
          console.log('error', error);
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        });
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSuperAdmin() {
    let users = await admin.auth().listUsers();
    console.log('users', users);
    let superUsers = users.users.filter(
      (singleUser) => singleUser.customClaims.SA,
    );
    if (superUsers.length === 0) {
      throw new HttpException(
        "Super Admin doesn't Exist",
        HttpStatus.BAD_REQUEST,
      );
    } else {
      let superAdminDetail = {
        email: superUsers[0].email,
        name: superUsers[0].displayName,
        uid: superUsers[0].uid,
      };
      return { super_admin: superAdminDetail };
    }
  }

  create(createGeneralDto: CreateGeneralDto) {
    return 'This action adds a new general';
  }

  findAll() {
    return `This action returns all general`;
  }

  findOne(id: number) {
    return `This action returns a #${id} general`;
  }

  update(id: number, updateGeneralDto: UpdateGeneralDto) {
    return `This action updates a #${id} general`;
  }

  remove(id: number) {
    return `This action removes a #${id} general`;
  }
}
