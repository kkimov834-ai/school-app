import {
  Box,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useMemo } from "react";
import studentData from "../data/studentData.json";
import teacherData from "../data/teacherData.json";
import classesData from "../data/classesData.json";

function DashBoard() {
  const totalStudents = studentData.length;
  const totalTeachers = teacherData.length;
  const totalClasses = classesData.length;
  const todaysAttendance = useMemo(
    () => Math.floor(Math.random() * (totalStudents - 75 + 1)) + 75,
    [totalStudents],
  );
  const cards = useMemo(
    () => [
      { title: "Toplam ogrenci", value: totalStudents },
      { title: "Toplam ogretmen", value: totalTeachers },
      { title: "Toplam Sinif", value: totalClasses },
      {
        title: "Bugunki Katilim",
        value: `${todaysAttendance} / ${totalStudents}`,
      },
    ],
    [todaysAttendance, totalClasses, totalStudents, totalTeachers],
  );

  const titleColor = useColorModeValue("gray.800", "gray.100");
  const subtitleColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <Box mb={6}>
        <Heading size={{ base: "md", sm: "lg" }} color={titleColor}>
          Dashboard
        </Heading>
        <Text mt={1} color={subtitleColor} fontSize={{ base: "sm", md: "md" }}>
          Okul Istatistiklerinin Genel ozeti
        </Text>
      </Box>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap={{ base: 3, sm: 4, md: 5 }}
      >
        {cards.map((card) => (
          <GridItem key={card.title}>
            <Stat
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={cardBorder}
              boxShadow="none"
            >
              <StatLabel
                color={subtitleColor}
                fontSize={{ base: "sm", md: "md" }}
              >
                {card.title}
              </StatLabel>
              <StatNumber
                color="blue.500"
                fontSize={{ base: "2xl", md: "3xl" }}
                mt={1}
              >
                {card.value}
              </StatNumber>
            </Stat>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(DashBoard);
