import { GetServerSideProps } from 'next';
import { PrismaClient, Post } from '@prisma/client';
import Container from '../components/Container';
import ImageGrid from '@/components/ImageGrid';

const prisma = new PrismaClient();

interface HomePageProps {
  posts: {
    id: string;
    title: string;
    imageUrl: string | null;
    createdAt: string;
  }[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const serializablePosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }));

    return {
      props: { posts: serializablePosts },
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      props: { posts: [] },
    };
  }
};

const HomePage = ({ posts }: HomePageProps) => {
  const imageGridItems = posts.map(post => ({
    imageUrl: post.imageUrl || 'https://via.placeholder.com/300',
    title: post.title,
    createdAt: post.createdAt,
  }));

  return (
    <Container>
      <main className="container mx-auto py-8">
        <ImageGrid items={imageGridItems} isLoading={false} />
      </main>
    </Container>
  );
};

export default HomePage;
