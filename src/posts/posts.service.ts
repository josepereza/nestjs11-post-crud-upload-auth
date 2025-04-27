import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    imagePath?: string,
  ): Promise<Post> {
    const newPost = new Post();
    newPost.content = createPostDto.content;
    newPost.title = createPostDto.title;
    const userId = createPostDto.userId;

    const user = await this.usersRepository.findOne({
      where: { user_ID: userId },
    });
    newPost.user = user!;
    //todo:  tenemos que cambiar el createPostDto con el newPost.
    const post = this.postsRepository.create({
      ...newPost,
      imagePath,
    });
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    imagePath?: string,
  ): Promise<Post> {
    const userId = updatePostDto.userId;
    const user = await this.usersRepository.findOne({
      where: { user_ID: userId },
    });
    console.log(updatePostDto, user);
    //const miupdate = { ...updatePostDto, userId: +updatePostDto.userId! };
    const post = await this.findOne(id);
    // post.userId = user!;
    //const miupdate = { updatePostDto, userId: +updatePostDto.userId! };

    this.postsRepository.merge(post, {
      title: updatePostDto.title,
      content: updatePostDto.content,
      user: user!,
    });

    if (imagePath) {
      post.imagePath = imagePath;
    }

    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }
}
