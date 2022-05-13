import { gql, useQuery } from '@apollo/client';
import Post from "../../components/Post/Post";


const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      createdAt,
      published,
      user {
        name
      }
    }
  }
`

export default function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return <div>
    {data.posts.map(post => <Post
      key={post.id}
      title={post.title}
      content={post.content}
      date={post.createdAt}
      user={post.user.name}
      published
      id={post.id}
      isMyProfile={false} />)}
  </div>;
}
