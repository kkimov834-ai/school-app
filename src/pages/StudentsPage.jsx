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
import studentData from "../data/studentData.json";
import classesData from "../data/classesData.json";

const AGE_KEYS = ["YaÅŸ", "Yaş"];
const PARENT_NAME_KEYS = ["Valideyn adÄ±", "Valideyn adı"];

function getExistingKey(record, keys) {
  return keys.find((key) => Object.prototype.hasOwnProperty.call(record, key));
}

function getValueByKeys(record, keys, fallback = "") {
  const matchedKey = getExistingKey(record, keys);
  if (!matchedKey) {
    return fallback;
  }

  return record[matchedKey];
}
function getParentName(student) {
  return String(getValueByKeys(student, PARENT_NAME_KEYS, "-"));
}

function getAge(student) {
  return Number(getValueByKeys(student, AGE_KEYS, 0));
}

function buildModalData(student) {
  return {
    Ad: student.Ad ?? "",
    Soyad: student.Soyad ?? "",
    Yas: String(getAge(student) || ""),
    Sinif: student.Sinif ?? "",
    ValideynAdi: String(getParentName(student) ?? ""),
  };
}

function updateStudentRecord(student, modalData) {
  const updatedStudent = {
    ...student,
    Ad: modalData.Ad.trim(),
    Soyad: modalData.Soyad.trim(),
    Sinif: modalData.Sinif.trim(),
  };

  const ageKey = getExistingKey(student, AGE_KEYS) ?? "YaÅŸ";
  const parentNameKey =
    getExistingKey(student, PARENT_NAME_KEYS) ?? "Valideyn adÄ±";

  updatedStudent[ageKey] = Number(modalData.Yas || 0);
  updatedStudent[parentNameKey] = modalData.ValideynAdi.trim();

  return updatedStudent;
}

function StudentsPage() {
  const [students, setStudents] = useState(studentData);
  const [modalMode, setModalMode] = useState("create");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minAgeInput, setMinAgeInput] = useState("");
  const [maxAgeInput, setMaxAgeInput] = useState("");
  const [selectedClassInput, setSelectedClassInput] = useState("");
  const [appliedMinAge, setAppliedMinAge] = useState("");
  const [appliedMaxAge, setAppliedMaxAge] = useState("");
  const [appliedClass, setAppliedClass] = useState("");
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [modalData, setModalData] = useState({
    Ad: "",
    Soyad: "",
    Yas: "",
    Sinif: "",
    ValideynAdi: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const classOptions = useMemo(
    () => [...new Set(classesData.map((item) => item.Sinif))].sort(),
    [],
  );

  const filteredStudents = useMemo(() => {
    const keyword = appliedSearch.trim().toLowerCase();
    const minAgeNumber = appliedMinAge === "" ? null : Number(appliedMinAge);
    const maxAgeNumber = appliedMaxAge === "" ? null : Number(appliedMaxAge);

    return students
      .map((student, index) => ({ student, index }))
      .filter(({ student }) => {
        const fullName = `${student.Ad} ${student.Soyad}`.toLowerCase();
        const parentName = String(getParentName(student)).toLowerCase();
        const className = String(student.Sinif);
        const age = getAge(student);

        const matchesSearch =
          keyword === "" ||
          fullName.includes(keyword) ||
          parentName.includes(keyword) ||
          className.toLowerCase().includes(keyword);
        const matchesClass = appliedClass === "" || className === appliedClass;
        const matchesMinAge = minAgeNumber === null || age >= minAgeNumber;
        const matchesMaxAge = maxAgeNumber === null || age <= maxAgeNumber;

        return matchesSearch && matchesClass && matchesMinAge && matchesMaxAge;
      });
  }, [students, appliedSearch, appliedMinAge, appliedMaxAge, appliedClass]);

  const applySearchAndFilters = useCallback(() => {
    setAppliedSearch(searchInput);
    setAppliedMinAge(minAgeInput);
    setAppliedMaxAge(maxAgeInput);
    setAppliedClass(selectedClassInput);
  }, [maxAgeInput, minAgeInput, searchInput, selectedClassInput]);

  const openStudentModal = useCallback(
    (student, index) => {
      setModalMode("edit");
      setSelectedStudentIndex(index);
      setModalData(buildModalData(student));
      onOpen();
    },
    [onOpen],
  );

  const openCreateModal = useCallback(() => {
    setModalMode("create");
    setSelectedStudentIndex(null);
    setModalData({
      Ad: "",
      Soyad: "",
      Yas: "",
      Sinif: "",
      ValideynAdi: "",
    });
    onOpen();
  }, [onOpen]);

  const closeStudentModal = useCallback(() => {
    setSelectedStudentIndex(null);
    setModalMode("create");
    onClose();
  }, [onClose]);

  const saveStudentModal = useCallback(() => {
    const safeAd = modalData.Ad.trim();
    const safeSoyad = modalData.Soyad.trim();
    const safeSinif = modalData.Sinif.trim();
    const safeYas = Number(modalData.Yas || 0);
    const safeValideyn = modalData.ValideynAdi.trim();

    if (!safeAd || !safeSoyad || !safeSinif || !safeYas || !safeValideyn) {
      return;
    }

    if (modalMode === "create") {
      setStudents((prev) => [
        ...prev,
        {
          Ad: safeAd,
          Soyad: safeSoyad,
          YaÅŸ: safeYas,
          Sinif: safeSinif,
          "Valideyn adÄ±": safeValideyn,
        },
      ]);
      closeStudentModal();
      return;
    }

    if (selectedStudentIndex === null) {
      return;
    }

    setStudents((prev) =>
      prev.map((student, index) => {
        if (index !== selectedStudentIndex) {
          return student;
        }

        return updateStudentRecord(student, modalData);
      }),
    );

    closeStudentModal();
  }, [closeStudentModal, modalData, modalMode, selectedStudentIndex]);

  const deleteStudent = useCallback((indexToDelete) => {
    setStudents((prev) => prev.filter((_, index) => index !== indexToDelete));
  }, []);

  const resetSearchAndFilters = useCallback(() => {
    setSearchInput("");
    setMinAgeInput("");
    setMaxAgeInput("");
    setSelectedClassInput("");
    setAppliedSearch("");
    setAppliedMinAge("");
    setAppliedMaxAge("");
    setAppliedClass("");
  }, []);

  const panelBg = useColorModeValue("white", "gray.800");
  const panelBorder = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const muted = useColorModeValue("gray.600", "gray.400");
  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const desktopStudentRows = useMemo(
    () =>
      filteredStudents.map(({ student, index }) => (
        <Tr
          key={`${student.Ad}-${student.Soyad}-${index}`}
          _hover={{ bg: rowHoverBg }}
          cursor="pointer"
          onClick={() => openStudentModal(student, index)}
        >
          <Td>{student.Ad}</Td>
          <Td>{student.Soyad}</Td>
          <Td>{getAge(student)}</Td>
          <Td>{student.Sinif}</Td>
          <Td>{getParentName(student)}</Td>
          <Td>
            <HStack justify="flex-end" spacing={2}>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteStudent(index);
                }}
              >
                Delete
              </Button>
            </HStack>
          </Td>
        </Tr>
      )),
    [deleteStudent, filteredStudents, openStudentModal, rowHoverBg],
  );
  const mobileStudentCards = useMemo(
    () =>
      filteredStudents.map(({ student, index }) => (
        <Box
          key={`${student.Ad}-${student.Soyad}-${index}`}
          bg={panelBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={panelBorder}
          p={4}
          cursor="pointer"
          onClick={() => openStudentModal(student, index)}
        >
          <Text fontWeight="semibold">
            {student.Ad} {student.Soyad}
          </Text>
          <Text color={muted} mt={1}>
            Yas: {getAge(student)}
          </Text>
          <Text color={muted}>Sinif: {student.Sinif}</Text>
          <Text color={muted}>Valideyn: {getParentName(student)}</Text>
          <HStack mt={3} spacing={2}>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              flex={1}
              onClick={(event) => {
                event.stopPropagation();
                deleteStudent(index);
              }}
            >
              Delete
            </Button>
          </HStack>
        </Box>
      )),
    [
      deleteStudent,
      filteredStudents,
      muted,
      openStudentModal,
      panelBg,
      panelBorder,
    ],
  );

  return (
    <VStack align="stretch" spacing={5}>
      <Box>
        <Heading size="lg" color={headingColor}>
          Login
        </Heading>
        <Text color={muted} mt={1}>
          Arama ve filtre ile ogrenci listesini yonetin
        </Text>
      </Box>

      <HStack
        spacing={3}
        align={{ base: "stretch", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Input
          placeholder="Ogrenci ara (ad, soyad, sinif, valideyn adi)"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          bg={panelBg}
          borderColor={panelBorder}
        />
        <Button
          variant={showFilters ? "solid" : "outline"}
          onClick={() => setShowFilters((prev) => !prev)}
          w={{ base: "100%", md: "auto" }}
        >
          Filter
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={openCreateModal}
          w={{ base: "100%", md: "auto" }}
        >
          Create
        </Button>
      </HStack>

      <Collapse in={showFilters} animateOpacity>
        <Box
          bg={panelBg}
          borderRadius="xl"
          p={4}
          borderWidth="1px"
          borderColor={panelBorder}
          boxShadow="sm"
        >
          <HStack
            spacing={3}
            align={{ base: "stretch", md: "end" }}
            flexWrap="wrap"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box w={{ base: "100%", md: "auto" }}>
              <Text fontSize="sm" mb={1} color={muted}>
                Min yas
              </Text>
              <Input
                size="sm"
                type="number"
                value={minAgeInput}
                onChange={(event) => setMinAgeInput(event.target.value)}
                w={{ base: "100%", md: "100px" }}
              />
            </Box>
            <Box w={{ base: "100%", md: "auto" }}>
              <Text fontSize="sm" mb={1} color={muted}>
                Max yas
              </Text>
              <Input
                size="sm"
                type="number"
                value={maxAgeInput}
                onChange={(event) => setMaxAgeInput(event.target.value)}
                w={{ base: "100%", md: "100px" }}
              />
            </Box>
            <Box
              w={{ base: "100%", md: "auto" }}
              minW={{ base: "100%", md: "170px" }}
            >
              <Text fontSize="sm" mb={1} color={muted}>
                Sinif
              </Text>
              <Select
                size="sm"
                value={selectedClassInput}
                onChange={(event) => setSelectedClassInput(event.target.value)}
              >
                <option value="">Tum siniflar</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </Select>
            </Box>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={applySearchAndFilters}
              w={{ base: "100%", md: "auto" }}
            >
              Ara
            </Button>
            <Button
              size="sm"
              variant="ghost"
              w={{ base: "100%", md: "auto" }}
              onClick={resetSearchAndFilters}
            >
              Sifirla
            </Button>
          </HStack>
        </Box>
      </Collapse>

      {filteredStudents.length === 0 ? (
        <Box
          bg={panelBg}
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor={panelBorder}
        >
          <Text color={muted}>Arama ve filtreye uygun ogrenci bulunamadi.</Text>
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
          boxShadow="sm"
          display={{ base: "none", md: "block" }}
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Ad</Th>
                <Th>Soyad</Th>
                <Th>Yas</Th>
                <Th>Sinif</Th>
                <Th>Valideyn adi</Th>
                <Th textAlign="right">Aksiyon</Th>
              </Tr>
            </Thead>
            <Tbody>{desktopStudentRows}</Tbody>
          </Table>
        </Box>
      )}

      {filteredStudents.length > 0 ? (
        <VStack
          display={{ base: "flex", md: "none" }}
          spacing={3}
          align="stretch"
        >
          {mobileStudentCards}
        </VStack>
      ) : null}

      <Modal
        isOpen={isOpen}
        onClose={closeStudentModal}
        isCentered
        size={{ base: "full", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalMode === "create" ? "Create ogrenci" : "Edit ogrenci"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
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

              <FormControl isRequired>
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

              <FormControl isRequired>
                <FormLabel>Yas</FormLabel>
                <Input
                  type="number"
                  min={1}
                  value={modalData.Yas}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Yas: event.target.value,
                    }))
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sinif</FormLabel>
                <Select
                  value={modalData.Sinif}
                  placeholder="Sinif secin"
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Sinif: event.target.value,
                    }))
                  }
                >
                  {classOptions.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Valideyn adi</FormLabel>
                <Input
                  value={modalData.ValideynAdi}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      ValideynAdi: event.target.value,
                    }))
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeStudentModal}>
              Legv et
            </Button>
            <Button colorScheme="blue" onClick={saveStudentModal}>
              {modalMode === "create" ? "Create" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default StudentsPage;
