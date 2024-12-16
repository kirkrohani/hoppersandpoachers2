import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';
import { PostType } from './enums/postType.enum';
import { PostStatus } from './enums/postStatus.enum';
import { type } from 'os';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedOn?: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags?: Tag[];

  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true,
  })
  metaOptions?: MetaOption;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  parentId: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  // @ManyToOne((_type) => User, (user) => user.posts, { eager: false })
  // @Exclude({ toPlainOnly: true })
  // user: User;
}
