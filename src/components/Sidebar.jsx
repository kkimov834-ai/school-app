import {
  Box,
  Button,
  Collapse,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { PiStudentFill } from "react-icons/pi";
import { GrUserManager } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const menuItems = [
  { label: "Dashboard", to: "/", icon: <MdDashboard /> },
  { label: "Ogrenciler", to: "/ogrenciler", icon: <PiStudentFill /> },
  { label: "Ogretmenler", to: "/ogretmenler", icon: <GrUserManager /> },
  { label: "Siniflar", to: "/siniflar", icon: <SiGoogleclassroom /> },
];

function Sidebar({ onLogout }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);
  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
  const handleToggleDesktopMenu = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inactiveColor = useColorModeValue("gray.700", "gray.200");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeColor = useColorModeValue("blue.700", "blue.100");

  return (
    <Box
      as="aside"
      w={{ base: "100%", md: isCollapsed ? "88px" : "250px" }}
      maxW="100%"
      bg={sidebarBg}
      borderRightWidth={{ base: "0", md: "1px" }}
      borderBottomWidth={{ base: "1px", md: "0" }}
      borderColor={borderColor}
      px={{ base: 3, md: 4 }}
      py={4}
      transition="width 0.2s ease"
      position="sticky"
      top="0"
      zIndex={20}
    >
      <Box display={{ base: "block", md: "none" }}>
        <HStack justify="space-between" mb={3}>
          <Text fontSize="sm" fontWeight="bold" color="blue.600" noOfLines={2}>
            Okul Yonetme Sistemi
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleMobileMenu}
          >
            {isMobileMenuOpen ? "Kapat" : "Menu"}
          </Button>
        </HStack>

        <Collapse in={isMobileMenuOpen} animateOpacity>
          <Stack spacing={2}>
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleCloseMobileMenu}
              >
                {({ isActive }) => (
                  <Box
                    px={3}
                    py={2}
                    borderRadius="md"
                    bg={isActive ? activeBg : "transparent"}
                    color={isActive ? activeColor : inactiveColor}
                    fontWeight={isActive ? "semibold" : "medium"}
                    _hover={{ bg: hoverBg }}
                  >
                    <HStack spacing={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {item.icon}
                      </Box>
                      <Text>{item.label}</Text>
                    </HStack>
                  </Box>
                )}
              </NavLink>
            ))}
          </Stack>
        </Collapse>

        <Button mt={4} size="sm" w="full" onClick={toggleColorMode}>
          {colorMode === "light" ? "Dark mode" : "Light mode"}
        </Button>
        <Button
          mt={2}
          size="sm"
          w="full"
          colorScheme="red"
          variant="outline"
          onClick={onLogout}
        >
          Cixis
        </Button>
      </Box>

      <Box display={{ base: "none", md: "block" }} h="full">
        <Stack h="full" spacing={0} justify="space-between">
          <Box>
            <Stack
              direction="row"
              align="center"
              justify={isCollapsed ? "center" : "space-between"}
              mb={4}
            >
              {!isCollapsed && (
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.600"
                  whiteSpace="nowrap"
                >
                  Okul Yonetme Sistemi
                </Text>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleDesktopMenu}
              >
                {isCollapsed ? ">" : "<"}
              </Button>
            </Stack>

            <Stack spacing={2}>
              {menuItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <Box
                      px={3}
                      py={2}
                      borderRadius="md"
                      bg={isActive ? activeBg : "transparent"}
                      color={isActive ? activeColor : inactiveColor}
                      fontWeight={isActive ? "semibold" : "medium"}
                      _hover={{ bg: hoverBg }}
                    >
                      <HStack
                        justify={isCollapsed ? "center" : "flex-start"}
                        spacing={isCollapsed ? 0 : 3}
                      >
                        <Box
                          fontSize="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {item.icon}
                        </Box>
                        {!isCollapsed && <Text>{item.label}</Text>}
                      </HStack>
                    </Box>
                  )}
                </NavLink>
              ))}
            </Stack>
          </Box>

          <Stack
            direction={isCollapsed ? "column" : "row"}
            align={isCollapsed ? "center" : "flex-start"}
            spacing={2}
            mt={6}
          >
            <IconButton
              size="sm"
              variant="outline"
              onClick={toggleColorMode}
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              aria-label={colorMode === "light" ? "Dark mode" : "Light mode"}
            />
            {!isCollapsed && (
              <Button size="sm" colorScheme="red" variant="outline" onClick={onLogout}>
                Cixis
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default memo(Sidebar);
