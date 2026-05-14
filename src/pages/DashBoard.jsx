import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import studentData from "../data/studentData.json";
import teacherData from "../data/teacherData.json";
import classesData from "../data/classesData.json";

function DashBoard() {
  const totalStudents = studentData.length;
  const totalTeachers = teacherData.length;
  const totalClasses = classesData.length;
  const todaysAttendance =
    Math.floor(Math.random() * (totalStudents - 75 + 1)) + 75;

  const cards = [
    { title: "Toplam öğrenci", value: totalStudents },
    { title: "Toplam öğretmen", value: totalTeachers },
    { title: "Toplam Sinif", value: totalClasses },
    {
      title: "Bugünki Katilim",
      value: `${todaysAttendance} / ${totalStudents}`,
    },
  ];

  const titleColor = useColorModeValue("gray.800", "gray.100");
  const subtitleColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <HStack justify="space-between" mb={6} align="start">
        <Box>
          <Heading size="lg" color={titleColor}>
            Dashboard
          </Heading>
          <Text mt={1} color={subtitleColor}>
            Okul Istatistiklerinin Genel özeti
          </Text>
        </Box>
      </HStack>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap={5}
      >
        {cards.map((card) => (
          <GridItem key={card.title}>
            <Stat
              bg={cardBg}
              p={6}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={cardBorder}
              boxShadow="none"
            >
              <StatLabel color={subtitleColor}>{card.title}</StatLabel>
              <StatNumber color="blue.500" fontSize="3xl" mt={1}>
                {card.value}
              </StatNumber>
              <Text mt={1} fontSize="sm" color={subtitleColor}>
                {card.note}
              </Text>
            </Stat>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

export default DashBoard;
