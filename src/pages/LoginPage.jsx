import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DEMO_CREDENTIALS,
  startAuthSession,
  validateLoginCredentials,
} from "../services/authService";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const pageBg = useColorModeValue("gray.100", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.400");

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setErrorMessage("");

      if (!username.trim() || !password) {
        setErrorMessage("Istifadeci adi ve sifre mecburidir.");
        return;
      }

      const isValid = validateLoginCredentials({ username, password });
      if (!isValid) {
        setErrorMessage("Istifadeci adi ve ya sifre sehvdir.");
        return;
      }

      startAuthSession();
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }

      navigate("/", { replace: true });
    },
    [navigate, onLoginSuccess, password, username],
  );

  return (
    <Box
      minH="100vh"
      bg={pageBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="100%"
        maxW="420px"
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="xl"
        p={{ base: 5, md: 7 }}
        boxShadow="lg"
      >
        <VStack align="stretch" spacing={4}>
          <Box>
            <Heading size="lg">Login</Heading>
            <Text color={muted} mt={1}>
              Okul yonetim paneline giris edin
            </Text>
          </Box>

          <FormControl isRequired>
            <FormLabel>Istifadeci adi</FormLabel>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Sifre</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="******"
            />
          </FormControl>

          {errorMessage ? (
            <Text color="red.500" fontSize="sm">
              {errorMessage}
            </Text>
          ) : null}

          <Text color={muted} fontSize="sm">
            Demo: {DEMO_CREDENTIALS.username} / {DEMO_CREDENTIALS.password}
          </Text>

          <Button colorScheme="blue" type="submit">
            Giris et
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default memo(LoginPage);
