import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  const pageBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }} bg={pageBg}>
      <Sidebar />
      <Box as="main" flex="1" p={{ base: 3, sm: 4, md: 6, lg: 8 }} overflowX="hidden">
        <Outlet />
      </Box>
    </Flex>
  );
}

export default AppLayout;
