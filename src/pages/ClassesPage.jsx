import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
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
import classesData from "../data/classesData.json";
import studentData from "../data/studentData.json";

function buildModalData(item) {
  return {
    Sinif: item.Sinif ?? "",
    StudentSayi: String(item.StudentSayi ?? ""),
  };
}

function updateClassRecord(item, modalData) {
  return {
    ...item,
    Sinif: modalData.Sinif,
    StudentSayi: Number(modalData.StudentSayi || 1),
  };
}

function ClassesPage() {
  const [classes, setClasses] = useState(classesData);
  const [selectedClassIndex, setSelectedClassIndex] = useState(null);
  const [modalData, setModalData] = useState({
    Sinif: "",
    StudentSayi: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const classOptions = useMemo(
    () =>
      [...new Set([...classes.map((item) => item.Sinif), ...studentData.map((student) => student.Sinif)].filter(Boolean))].sort(),
    [classes],
  );

  const studentCountOptions = useMemo(() => Array.from({ length: 20 }, (_, index) => String(index + 1)), []);

  const openClassModal = (item, index) => {
    setSelectedClassIndex(index);
    setModalData(buildModalData(item));
    onOpen();
  };

  const closeClassModal = () => {
    setSelectedClassIndex(null);
    onClose();
  };

  const saveClassModal = () => {
    if (selectedClassIndex === null) {
      return;
    }

    const safeCount = Math.min(20, Math.max(1, Number(modalData.StudentSayi || 1)));

    setClasses((prev) =>
      prev.map((item, index) => {
        if (index !== selectedClassIndex) {
          return item;
        }

        return updateClassRecord(item, {
          ...modalData,
          StudentSayi: String(safeCount),
        });
      }),
    );

    closeClassModal();
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
          Siniflar
        </Heading>
        <Text color={muted} mt={1}>
          Sinif bazinda ogrenci sayilari
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
              <Th>Sinif</Th>
              <Th>Ogrenci Sayisi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {classes.map((item, index) => (
              <Tr
                key={`${item.Sinif}-${index}`}
                cursor="pointer"
                _hover={{ bg: rowHoverBg }}
                onClick={() => openClassModal(item, index)}
              >
                <Td>{item.Sinif}</Td>
                <Td>{item.StudentSayi}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={closeClassModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sinif duzenle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Sinif</FormLabel>
                <Select
                  value={modalData.Sinif}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Sinif: event.target.value,
                    }))
                  }
                >
                  {modalData.Sinif && !classOptions.includes(modalData.Sinif) ? (
                    <option value={modalData.Sinif}>{modalData.Sinif}</option>
                  ) : null}
                  {classOptions.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Ogrenci Sayisi</FormLabel>
                <Select
                  value={modalData.StudentSayi}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      StudentSayi: event.target.value,
                    }))
                  }
                >
                  {studentCountOptions.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeClassModal}>
              Legv et
            </Button>
            <Button colorScheme="blue" onClick={saveClassModal}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default ClassesPage;
