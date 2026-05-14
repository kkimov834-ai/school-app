import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import teacherData from "../data/teacherData.json";

function getSubject(teacher) {
  return teacher["F\u0259nn"] || teacher["Fenn"] || teacher["FÃ‰â„¢nn"] || "-";
}

function buildModalData(teacher) {
  return {
    Ad: teacher.Ad ?? "",
    Soyad: teacher.Soyad ?? "",
    Fenn: getSubject(teacher) === "-" ? "" : getSubject(teacher),
  };
}

function updateTeacherRecord(teacher, modalData) {
  const updatedTeacher = {
    ...teacher,
    Ad: modalData.Ad,
    Soyad: modalData.Soyad,
  };

  if (Object.prototype.hasOwnProperty.call(teacher, "F\u0259nn")) {
    updatedTeacher["F\u0259nn"] = modalData.Fenn;
  } else if (Object.prototype.hasOwnProperty.call(teacher, "Fenn")) {
    updatedTeacher.Fenn = modalData.Fenn;
  } else if (Object.prototype.hasOwnProperty.call(teacher, "FÃ‰â„¢nn")) {
    updatedTeacher["FÃ‰â„¢nn"] = modalData.Fenn;
  } else {
    updatedTeacher["F\u0259nn"] = modalData.Fenn;
  }

  return updatedTeacher;
}

function TeachersPage() {
  const [teachers, setTeachers] = useState(teacherData);
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState(null);
  const [modalData, setModalData] = useState({
    Ad: "",
    Soyad: "",
    Fenn: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const subjectOptions = useMemo(
    () =>
      [...new Set(teachers.map((teacher) => getSubject(teacher)).filter((subject) => subject !== "-"))].sort(),
    [teachers],
  );

  const openTeacherModal = (teacher, index) => {
    setSelectedTeacherIndex(index);
    setModalData(buildModalData(teacher));
    onOpen();
  };

  const closeTeacherModal = () => {
    setSelectedTeacherIndex(null);
    onClose();
  };

  const saveTeacherModal = () => {
    if (selectedTeacherIndex === null) {
      return;
    }

    setTeachers((prev) =>
      prev.map((teacher, index) => {
        if (index !== selectedTeacherIndex) {
          return teacher;
        }

        return updateTeacherRecord(teacher, modalData);
      }),
    );

    closeTeacherModal();
  };

  const panelBg = useColorModeValue("white", "gray.800");
  const panelBorder = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const muted = useColorModeValue("gray.600", "gray.400");
  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <VStack align="stretch" spacing={5}>
      <Box>
        <Heading size="lg" color={headingColor}>
          Ogretmenler
        </Heading>
        <Text color={muted} mt={1}>
          Ogretmen listesi ve fenn bilgileri
        </Text>
      </Box>

      <Box
        bg={panelBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={panelBorder}
        overflowX="auto"
        overflowY="auto"
        maxH={{ base: "50vh", md: "60vh" }}
      >
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Ad</Th>
              <Th>Soyad</Th>
              <Th>Fenn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teachers.map((teacher, index) => (
              <Tr
                key={`${teacher.Ad}-${teacher.Soyad}-${index}`}
                cursor="pointer"
                _hover={{ bg: rowHoverBg }}
                onClick={() => openTeacherModal(teacher, index)}
              >
                <Td>{teacher.Ad}</Td>
                <Td>{teacher.Soyad}</Td>
                <Td>{getSubject(teacher)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={closeTeacherModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ogretmen duzenle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Ad</FormLabel>
                <Input
                  value={modalData.Ad}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Ad: event.target.value,
                    }))
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Soyad</FormLabel>
                <Input
                  value={modalData.Soyad}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Soyad: event.target.value,
                    }))
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Fenn</FormLabel>
                <Select
                  value={modalData.Fenn}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Fenn: event.target.value,
                    }))
                  }
                >
                  {modalData.Fenn && !subjectOptions.includes(modalData.Fenn) ? (
                    <option value={modalData.Fenn}>{modalData.Fenn}</option>
                  ) : null}
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeTeacherModal}>
              Legv et
            </Button>
            <Button colorScheme="blue" onClick={saveTeacherModal}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default TeachersPage;
