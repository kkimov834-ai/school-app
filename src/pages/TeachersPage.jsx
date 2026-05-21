import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  HStack,
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
import { useCallback, useMemo, useState } from "react";
import teacherData from "../data/teacherData.json";

const SUBJECT_KEYS = ["F\\u0259nn", "Fənn"];

function getSubject(teacher) {
  for (const key of SUBJECT_KEYS) {
    const value = teacher[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "-";
}

function buildModalData(teacher) {
  return {
    Ad: teacher.Ad ?? "",
    Soyad: teacher.Soyad ?? "",
    Fenn: getSubject(teacher) === "-" ? "" : getSubject(teacher),
  };
}

function updateTeacherRecord(teacher, modalData) {
  const safeAd = modalData.Ad.trim();
  const safeSoyad = modalData.Soyad.trim();
  const safeFenn = modalData.Fenn.trim();

  const updatedTeacher = {
    ...teacher,
    Ad: safeAd,
    Soyad: safeSoyad,
  };

  const existingSubjectKey = SUBJECT_KEYS.find((key) =>
    Object.prototype.hasOwnProperty.call(teacher, key),
  );

  if (existingSubjectKey) {
    updatedTeacher[existingSubjectKey] = safeFenn;
  } else {
    updatedTeacher["F\\u0259nn"] = safeFenn;
  }

  return updatedTeacher;
}

function TeachersPage() {
  const [teachers, setTeachers] = useState(teacherData);
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [modalData, setModalData] = useState({
    Ad: "",
    Soyad: "",
    Fenn: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [activeSubjectFilter, setActiveSubjectFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const subjectOptions = useMemo(
    () =>
      [
        ...new Set(
          teacherData
            .map((teacher) => getSubject(teacher))
            .filter((subject) => subject !== "-"),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const filteredTeacherRows = useMemo(() => {
    return teachers.reduce((acc, teacher, index) => {
      if (!activeSubjectFilter || getSubject(teacher) === activeSubjectFilter) {
        acc.push({ teacher, index });
      }
      return acc;
    }, []);
  }, [activeSubjectFilter, teachers]);

  const openCreateModal = useCallback(() => {
    setModalMode("create");
    setSelectedTeacherIndex(null);
    setModalData({
      Ad: "",
      Soyad: "",
      Fenn: "",
    });
    onOpen();
  }, [onOpen]);

  const openEditModal = useCallback(
    (teacher, index) => {
      setModalMode("edit");
      setSelectedTeacherIndex(index);
      setModalData(buildModalData(teacher));
      onOpen();
    },
    [onOpen],
  );

  const closeTeacherModal = useCallback(() => {
    setSelectedTeacherIndex(null);
    setModalMode("create");
    onClose();
  }, [onClose]);

  const runSubjectFilter = useCallback(() => {
    setActiveSubjectFilter(subjectInput);
  }, [subjectInput]);

  const saveTeacherModal = useCallback(() => {
    const safeAd = modalData.Ad.trim();
    const safeSoyad = modalData.Soyad.trim();
    const safeFenn = modalData.Fenn.trim();

    if (!safeAd || !safeSoyad || !safeFenn) {
      return;
    }

    if (modalMode === "create") {
      setTeachers((prev) => [
        ...prev,
        { Ad: safeAd, Soyad: safeSoyad, "F\\u0259nn": safeFenn },
      ]);
      closeTeacherModal();
      return;
    }

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
  }, [closeTeacherModal, modalData, modalMode, selectedTeacherIndex]);

  const deleteTeacher = useCallback((indexToDelete) => {
    setTeachers((prev) => prev.filter((_, index) => index !== indexToDelete));
  }, []);

  const panelBg = useColorModeValue("white", "gray.800");
  const panelBorder = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const muted = useColorModeValue("gray.600", "gray.400");
  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const desktopTeacherRows = useMemo(() => {
    if (filteredTeacherRows.length === 0) {
      return (
        <Tr>
          <Td colSpan={4}>
            <Text color={muted}>Secilen fenn uzre netice tapilmadi.</Text>
          </Td>
        </Tr>
      );
    }

    return filteredTeacherRows.map(({ teacher, index }) => (
      <Tr
        key={`${teacher.Ad}-${teacher.Soyad}-${index}`}
        cursor="pointer"
        _hover={{ bg: rowHoverBg }}
        onClick={() => openEditModal(teacher, index)}
      >
        <Td>{teacher.Ad}</Td>
        <Td>{teacher.Soyad}</Td>
        <Td>{getSubject(teacher)}</Td>
        <Td>
          <HStack justify="flex-end" spacing={2}>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={(event) => {
                event.stopPropagation();
                deleteTeacher(index);
              }}
            >
              Delete
            </Button>
          </HStack>
        </Td>
      </Tr>
    ));
  }, [deleteTeacher, filteredTeacherRows, muted, openEditModal, rowHoverBg]);
  const mobileTeacherCards = useMemo(() => {
    if (filteredTeacherRows.length === 0) {
      return (
        <Box
          bg={panelBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={panelBorder}
          p={4}
        >
          <Text color={muted}>Secilen fenn uzre netice tapilmadi.</Text>
        </Box>
      );
    }

    return filteredTeacherRows.map(({ teacher, index }) => (
      <Box
        key={`${teacher.Ad}-${teacher.Soyad}-${index}`}
        bg={panelBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={panelBorder}
        p={4}
        cursor="pointer"
        onClick={() => openEditModal(teacher, index)}
      >
        <Text fontWeight="semibold">
          {teacher.Ad} {teacher.Soyad}
        </Text>
        <Text color={muted} mt={1}>
          Fenn: {getSubject(teacher)}
        </Text>
        <HStack mt={3} spacing={2}>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            flex={1}
            onClick={(event) => {
              event.stopPropagation();
              deleteTeacher(index);
            }}
          >
            Delete
          </Button>
        </HStack>
      </Box>
    ));
  }, [
    deleteTeacher,
    filteredTeacherRows,
    muted,
    openEditModal,
    panelBg,
    panelBorder,
  ]);

  return (
    <VStack align="stretch" spacing={5}>
      <HStack
        justify="space-between"
        align={{ base: "flex-start", lg: "center" }}
        flexDir={{ base: "column", lg: "row" }}
      >
        <Box>
          <Heading size="lg" color={headingColor}>
            Ogretmenler
          </Heading>
          <Text color={muted} mt={1}>
            Ogretmen listesi ve fenn bilgileri
          </Text>
        </Box>

        <HStack
          spacing={3}
          w={{ base: "100%", lg: "auto" }}
          justify={{ base: "flex-start", lg: "flex-end" }}
        >
          <Button
            colorScheme="blue"
            onClick={openCreateModal}
            w={{ base: "100%", sm: "auto" }}
          >
            Create
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            w={{ base: "100%", sm: "auto" }}
          >
            Filter
          </Button>
        </HStack>
      </HStack>

      <Collapse in={isFilterOpen} animateOpacity>
        <Box
          borderWidth="1px"
          borderColor={panelBorder}
          borderRadius="lg"
          p={3}
          bg={panelBg}
        >
          <HStack
            spacing={3}
            w="100%"
            flexDir={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
          >
            <Select
              value={subjectInput}
              onChange={(event) => setSubjectInput(event.target.value)}
              w={{ base: "100%", sm: "220px" }}
            >
              <option value="">Butun fennler</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
            <Button
              variant="outline"
              onClick={runSubjectFilter}
              w={{ base: "100%", sm: "auto" }}
            >
              Ara
            </Button>
          </HStack>
        </Box>
      </Collapse>

      <Box
        bg={panelBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={panelBorder}
        overflowX="auto"
        overflowY="auto"
        maxH={{ base: "50vh", md: "60vh" }}
        display={{ base: "none", md: "block" }}
      >
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Ad</Th>
              <Th>Soyad</Th>
              <Th>Fenn</Th>
              <Th textAlign="right">Aksiyon</Th>
            </Tr>
          </Thead>
          <Tbody>{desktopTeacherRows}</Tbody>
        </Table>
      </Box>

      <VStack
        display={{ base: "flex", md: "none" }}
        spacing={3}
        align="stretch"
      >
        {mobileTeacherCards}
      </VStack>

      <Modal
        isOpen={isOpen}
        onClose={closeTeacherModal}
        isCentered
        size={{ base: "full", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalMode === "create" ? "Create ogretmen" : "Edit ogretmen"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Ad</FormLabel>
                <Input
                  value={modalData.Ad}
                  placeholder="Meselen: Rasim"
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Ad: event.target.value,
                    }))
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Soyad</FormLabel>
                <Input
                  value={modalData.Soyad}
                  placeholder="Meselen: Mammadov"
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Soyad: event.target.value,
                    }))
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fenn</FormLabel>
                <Select
                  value={modalData.Fenn}
                  placeholder="Fenn secin"
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Fenn: event.target.value,
                    }))
                  }
                >
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
              {modalMode === "create" ? "Create" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default TeachersPage;
