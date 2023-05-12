import { EntityRepository, Repository } from 'typeorm';
import { Seller } from './seller.entity';

@EntityRepository(Seller)
export class SellerRepository extends Repository<Seller> {}
