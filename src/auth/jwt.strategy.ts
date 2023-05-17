import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private entityManager: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret',
    });
  }

  async validate(payload: { id: number }) {
    const { id } = payload;
    const queryBuilder = this.entityManager.createQueryBuilder(User, 'user');
    queryBuilder
      .select(['user.name', 'user.email', 'user.status', 'user.role'])
      .where('user.id = :id', { id });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}
