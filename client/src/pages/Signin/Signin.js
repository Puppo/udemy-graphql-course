import { useEffect, useState } from "react";

import Button from "@restart/ui/esm/Button";
import { Form } from "react-bootstrap";

import { gql, useMutation } from '@apollo/client';

const SIGN_IN = gql`
  mutation signIn($credentials: CredentialsInput!) {
    signIn(credentials: $credentials) {
      token,
      userErrors {
        message
      }
    }
  }
`

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signIn, { data }] = useMutation(SIGN_IN);

  const handleClick = () => {
    signIn({
      variables: {
        credentials: {
          email,
          password,
        }
      }
    })
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      if (data.signIn.userErrors.length > 0) {
        setError(data.signIn.userErrors.map(({ message }) => message).join(", "));
      }
      const { token } = data.signIn;
      localStorage.setItem("token", token);
    }
  }, [data]);

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {error && <p>{error}</p>}
        <Button onClick={handleClick}>Signin</Button>
      </Form>
    </div>
  );
}
