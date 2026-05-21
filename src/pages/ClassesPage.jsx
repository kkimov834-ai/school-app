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
import classesData from "../data/classesData.json";

function buildModalData(item) {
  return {
    Sinif: item.Sinif ?? "",
    StudentSayi: String(item.StudentSayi ?? ""),
  };
}

function updateClassRecord(item, modalData) {
  return {
    ...item,
    Sinif: modalData.Sinif.trim(),
    StudentSayi: Number(modalData.StudentSayi || 1),
  };
}

function ClassesPage() {
  const [classes, setClasses] = useState(classesData);
  const [selectedClassIndex, setSelectedClassIndex] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minStudentInput, setMinStudentInput] = useState("");
  const [maxStudentInput, setMaxStudentInput] = useState("");
  const [appliedMinStudent, setAppliedMinStudent] = useState("");
  const [appliedMaxStudent, setAppliedMaxStudent] = useState("");
  const [modalData, setModalData] = useState({
    Sinif: "",
    StudentSayi: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const classOptions = useMemo(
    () => [...new Set(classesData.map((item) => item.Sinif))].sort(),
    [],
  );

  const openCreateModal = useCallback(() => {
    setModalMode("create");
    setSelectedClassIndex(null);
    setModalData({
      Sinif: "",
      StudentSayi: "",
    });
    onOpen();
  }, [onOpen]);

  const openEditModal = useCallback(
    (item, index) => {
      const sourceItem =
        classesData.find((classItem) => classItem.Sinif === item.Sinif) ?? item;

      setModalMode("edit");
      setSelectedClassIndex(index);
      setModalData(buildModalData(sourceItem));
      onOpen();
    },
    [onOpen],
  );

  const closeClassModal = useCallback(() => {
    setSelectedClassIndex(null);
    setModalMode("create");
    onClose();
  }, [onClose]);

  const handleClassChange = useCallback((event) => {
    const selectedClass = event.target.value;
    const selectedClassFromData = classesData.find(
      (item) => item.Sinif === selectedClass,
    );

    setModalData((prev) => ({
      ...prev,
      Sinif: selectedClass,
      StudentSayi: String(
        selectedClassFromData?.StudentSayi ?? prev.StudentSayi,
      ),
    }));
  }, []);

  const saveClassModal = useCallback(() => {
    const className = modalData.Sinif.trim();
    if (!className) {
      return;
    }

    const safeCount = Math.max(0, Number(modalData.StudentSayi || 0));

    if (modalMode === "create") {
      setClasses((prev) => [
        ...prev,
        {
          Sinif: className,
          StudentSayi: safeCount,
          Students: [],
        },
      ]);
      closeClassModal();
      return;
    }

    if (selectedClassIndex === null) {
      return;
    }

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
  }, [closeClassModal, modalData, modalMode, selectedClassIndex]);

  const deleteClass = useCallback((indexToDelete) => {
    setClasses((prev) => prev.filter((_, index) => index !== indexToDelete));
  }, []);
  const runStudentCountFilter = useCallback(() => {
    setAppliedMinStudent(minStudentInput);
    setAppliedMaxStudent(maxStudentInput);
  }, [maxStudentInput, minStudentInput]);
  const resetStudentCountFilter = useCallback(() => {
    setMinStudentInput("");
    setMaxStudentInput("");
    setAppliedMinStudent("");
    setAppliedMaxStudent("");
  }, []);

  const panelBg = useColorModeValue("white", "gray.800");
  const panelBorder = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const muted = useColorModeValue("gray.600", "gray.400");
  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const filteredClasses = useMemo(() => {
    const minCount =
      appliedMinStudent === "" ? null : Number(appliedMinStudent);
    const maxCount =
      appliedMaxStudent === "" ? null : Number(appliedMaxStudent);

    return classes
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const studentCount = Number(item.StudentSayi || 0);
        const matchesMin = minCount === null || studentCount >= minCount;
        const matchesMax = maxCount === null || studentCount <= maxCount;
        return matchesMin && matchesMax;
      });
  }, [appliedMaxStudent, appliedMinStudent, classes]);
  const desktopClassRows = useMemo(
    () =>
      filteredClasses.map(({ item, index }) => (
        <Tr
          key={`${item.Sinif}-${index}`}
          cursor="pointer"
          _hover={{ bg: rowHoverBg }}
          onClick={() => openEditModal(item, index)}
        >
          <Td>{item.Sinif}</Td>
          <Td>{item.StudentSayi}</Td>
          <Td>
            <HStack justify="flex-end" spacing={2}>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteClass(index);
                }}
              >
                Delete
              </Button>
            </HStack>
          </Td>
        </Tr>
      )),
    [deleteClass, filteredClasses, openEditModal, rowHoverBg],
  );
  const mobileClassCards = useMemo(
    () =>
      filteredClasses.map(({ item, index }) => (
        <Box
          key={`${item.Sinif}-${index}`}
          bg={panelBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={panelBorder}
          p={4}
          cursor="pointer"
          onClick={() => openEditModal(item, index)}
        >
          <Text fontWeight="semibold">{item.Sinif}</Text>
          <Text color={muted} mt={1}>
            Ogrenci Sayisi: {item.StudentSayi}
          </Text>
          <HStack mt={3} spacing={2}>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              flex={1}
              onClick={(event) => {
                event.stopPropagation();
                deleteClass(index);
              }}
            >
              Delete
            </Button>
          </HStack>
        </Box>
      )),
    [deleteClass, filteredClasses, muted, openEditModal, panelBg, panelBorder],
  );

  return (
    <VStack align="stretch" spacing={5}>
      <HStack
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        flexDir={{ base: "column", md: "row" }}
      >
        <Heading size="lg" color={headingColor}>
          Siniflar
        </Heading>
        <HStack
          spacing={3}
          w={{ base: "100%", md: "auto" }}
          flexDir={{ base: "column", sm: "row" }}
        >
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            w={{ base: "100%", sm: "auto" }}
          >
            Filter
          </Button>
          <Button
            colorScheme="blue"
            onClick={openCreateModal}
            w={{ base: "100%", sm: "auto" }}
          >
            Create
          </Button>
        </HStack>
      </HStack>

      <Text color={muted} mt={-3}>
        Sinif bazinda ogrenci sayilari
      </Text>

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
            flexDir={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "end" }}
          >
            <Box w={{ base: "100%", md: "auto" }}>
              <Text fontSize="sm" mb={1} color={muted}>
                Min say
              </Text>
              <Input
                size="sm"
                type="number"
                min={1}
                value={minStudentInput}
                onChange={(event) => setMinStudentInput(event.target.value)}
                w={{ base: "100%", md: "120px" }}
              />
            </Box>
            <Box w={{ base: "100%", md: "auto" }}>
              <Text fontSize="sm" mb={1} color={muted}>
                Max say
              </Text>
              <Input
                size="sm"
                type="number"
                min={1}
                value={maxStudentInput}
                onChange={(event) => setMaxStudentInput(event.target.value)}
                w={{ base: "100%", md: "120px" }}
              />
            </Box>
            <Button
              size="sm"
              variant="outline"
              onClick={runStudentCountFilter}
              w={{ base: "100%", md: "auto" }}
            >
              Ara
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetStudentCountFilter}
              w={{ base: "100%", md: "auto" }}
            >
              Sifirla
            </Button>
          </HStack>
        </Box>
      </Collapse>

      {filteredClasses.length === 0 ? (
        <Box
          bg={panelBg}
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor={panelBorder}
        >
          <Text color={muted}>Filtreye uygun sinif bulunamadi.</Text>
        </Box>
      ) : (
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
                <Th>Sinif</Th>
                <Th>Ogrenci Sayisi</Th>
                <Th textAlign="right">Aksiyon</Th>
              </Tr>
            </Thead>
            <Tbody>{desktopClassRows}</Tbody>
          </Table>
        </Box>
      )}

      {filteredClasses.length > 0 ? (
        <VStack
          display={{ base: "flex", md: "none" }}
          spacing={3}
          align="stretch"
        >
          {mobileClassCards}
        </VStack>
      ) : null}

      <Modal
        isOpen={isOpen}
        onClose={closeClassModal}
        isCentered
        size={{ base: "full", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalMode === "create" ? "Create sinif" : "Edit sinif"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Sinif</FormLabel>
                <Select
                  value={modalData.Sinif}
                  placeholder="Sinif secin"
                  onChange={handleClassChange}
                >
                  {classOptions.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Ogrenci Sayisi</FormLabel>
                <Input
                  type="number"
                  min={0}
                  value={modalData.StudentSayi}
                  placeholder="Meselen: 25"
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      StudentSayi: event.target.value,
                    }))
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeClassModal}>
              Legv et
            </Button>
            <Button colorScheme="blue" onClick={saveClassModal}>
              {modalMode === "create" ? "Create" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default ClassesPage;
