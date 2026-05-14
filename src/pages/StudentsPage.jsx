import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
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
import studentData from "../data/studentData.json";

function getParentName(student) {
  return (
    student["Valideyn adı"] ||
    student["Valideyn adi"] ||
    student["Valideyn adÄ±"] ||
    "-"
  );
}

function getAge(student) {
  return Number(student["Yaş"] ?? student.Yas ?? 0);
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
    Ad: modalData.Ad,
    Soyad: modalData.Soyad,
    Sinif: modalData.Sinif,
  };

  if (Object.prototype.hasOwnProperty.call(student, "Yaş")) {
    updatedStudent["Yaş"] = Number(modalData.Yas || 0);
  } else {
    updatedStudent.Yas = Number(modalData.Yas || 0);
  }

  if (Object.prototype.hasOwnProperty.call(student, "Valideyn adı")) {
    updatedStudent["Valideyn adı"] = modalData.ValideynAdi;
  } else if (Object.prototype.hasOwnProperty.call(student, "Valideyn adi")) {
    updatedStudent["Valideyn adi"] = modalData.ValideynAdi;
  } else if (Object.prototype.hasOwnProperty.call(student, "Valideyn adÄ±")) {
    updatedStudent["Valideyn adÄ±"] = modalData.ValideynAdi;
  } else {
    updatedStudent["Valideyn adı"] = modalData.ValideynAdi;
  }

  return updatedStudent;
}

function StudentsPage() {
  const [students, setStudents] = useState(studentData);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
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
    () => [...new Set(studentData.map((student) => student.Sinif))].sort(),
    [],
  );

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const minAgeNumber = minAge === "" ? null : Number(minAge);
    const maxAgeNumber = maxAge === "" ? null : Number(maxAge);

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
        const matchesClass = selectedClass === "" || className === selectedClass;
        const matchesMinAge = minAgeNumber === null || age >= minAgeNumber;
        const matchesMaxAge = maxAgeNumber === null || age <= maxAgeNumber;

        return matchesSearch && matchesClass && matchesMinAge && matchesMaxAge;
      });
  }, [students, search, minAge, maxAge, selectedClass]);

  const openStudentModal = (student, index) => {
    setSelectedStudentIndex(index);
    setModalData(buildModalData(student));
    onOpen();
  };

  const closeStudentModal = () => {
    setSelectedStudentIndex(null);
    onClose();
  };

  const saveStudentModal = () => {
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
          Ogrenciler
        </Heading>
        <Text color={muted} mt={1}>
          Arama ve filtre ile ogrenci listesini yonetin
        </Text>
      </Box>

      <InputGroup>
        <Input
          placeholder="Ogrenci ara (ad, soyad, sinif, valideyn adi)"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          bg={panelBg}
          borderColor={panelBorder}
          pr="120px"
        />
        <InputRightElement width="110px">
          <Button
            size="sm"
            colorScheme="blue"
            variant={showFilters ? "solid" : "outline"}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filter
          </Button>
        </InputRightElement>
      </InputGroup>

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
                value={minAge}
                onChange={(event) => setMinAge(event.target.value)}
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
                value={maxAge}
                onChange={(event) => setMaxAge(event.target.value)}
                w={{ base: "100%", md: "100px" }}
              />
            </Box>
            <Box w={{ base: "100%", md: "auto" }} minW={{ base: "100%", md: "170px" }}>
              <Text fontSize="sm" mb={1} color={muted}>
                Sinif
              </Text>
              <Select
                size="sm"
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
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
              variant="ghost"
              w={{ base: "100%", md: "auto" }}
              onClick={() => {
                setMinAge("");
                setMaxAge("");
                setSelectedClass("");
              }}
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
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Ad</Th>
                <Th>Soyad</Th>
                <Th>Yas</Th>
                <Th>Sinif</Th>
                <Th>Valideyn adi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredStudents.map(({ student, index }) => (
                <Tr
                  key={`${student.Ad}-${student.Soyad}-${index}`}
                  cursor="pointer"
                  _hover={{ bg: rowHoverBg }}
                  onClick={() => openStudentModal(student, index)}
                >
                  <Td>{student.Ad}</Td>
                  <Td>{student.Soyad}</Td>
                  <Td>{getAge(student)}</Td>
                  <Td>{student.Sinif}</Td>
                  <Td>{getParentName(student)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={closeStudentModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ogrenci duzenle</ModalHeader>
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
                <FormLabel>Yas</FormLabel>
                <Input
                  type="number"
                  value={modalData.Yas}
                  onChange={(event) =>
                    setModalData((prev) => ({
                      ...prev,
                      Yas: event.target.value,
                    }))
                  }
                />
              </FormControl>

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
                  {classOptions.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
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
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default StudentsPage;
