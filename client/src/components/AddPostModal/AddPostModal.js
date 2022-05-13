import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const POST_CREATE = gql`
  mutation($title: String!, $content: String!) {
    postCreate(post: { title: $title, content: $content }) {
      post {
        id
        title
        content
        user {
          name
        }
      }
      userErrors {
        message
      }
    }
  }
`;


export default function AddPostModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [postCreate, { data }] = useMutation(POST_CREATE)

  const handleClick = () => {
    if (!content || !title) return;
    postCreate({
      variables: {
        content,
        title
      }
    })
  };

  useEffect(() => {
    if (data) {
      if (data.postCreate.post) {
        setShow(false);
      }
    }
  }, [data])


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Post
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
