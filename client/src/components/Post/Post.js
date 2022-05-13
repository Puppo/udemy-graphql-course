import { gql, useMutation } from '@apollo/client';
import "./Post.css";

const PUBLISH_POST = gql`
  mutation postPublish($postId: ID!) {
    postPublish(postId: $postId) {
      post {
        id
        published
      }
    }
  }
`

const UNPUBLISH_POST = gql`
  mutation postUnpublish($postId: ID!) {
    postUnpublish(postId: $postId) {
      post {
        id
        published
      }
    }
  }
`


export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const formatedDate = new Date(Number(date));

  const [publishPost] = useMutation(PUBLISH_POST)
  const [unpublishPost] = useMutation(UNPUBLISH_POST)

  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && published === false && (
        <button className="Post__publish" onClick={() => {
          publishPost({ variables: { postId: id } })
        }}>
          publish
        </button>
      )}
      {isMyProfile && published === true && (
        <button className="Post__publish" onClick={() => {
          unpublishPost({ variables: { postId: id } })
        }}>
          unpublish
        </button>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
