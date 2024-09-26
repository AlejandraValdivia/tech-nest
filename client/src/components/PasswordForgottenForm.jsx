import { Text, Stack, Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendResetEmail } from "../redux/actions/userActions";

const PasswordForgottenForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Box my="4">
        <Text as="b">
          Enter your email address below and we'll send you a link to reset your
          password.
        </Text>
      </Box>
      <Stack>
        <Input
          mb="4"
          type="text"
          name="email"
          placeholder="Your Email Address"
          label="Email"
          value={email}
          onChange={handleChange}
        ></Input>
        <Button colorScheme="yellow" size='lg' fontSize='md' onClick={() => dispatch(sendResetEmail(email))}>Send Reset Email</Button>
      </Stack>
    </>
  );
};

export default PasswordForgottenForm;
