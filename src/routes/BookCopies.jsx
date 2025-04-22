import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import ChangeLibraryModal from "../components/BookCopies/ChangeAttributes.jsx";
import CreateCopyModal from "../components/BookCopies/CreateCopyModal";

export default function BookCopies() {
  const { title } = useParams();
  const [copies, setCopies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [libraries, setLibraries] = useState([]);
  const [newCopy, setNewCopy] = useState({ barcode: "", libraryName: "" });
  const [showModal, setShowModal] = useState(false);
  const [showChangeLibraryModal, setShowChangeLibraryModal] = useState(false);
  const [selectedCopyId, setSelectedCopyId] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [barcodeFilter, setBarcodeFilter] = useState("");
  const [libraryFilter, setLibraryFilter] = useState("");

  useEffect(() => {
    fetchBookCopies();
  }, [title]);

  useEffect(() => {
    setPage(0);
    setCopies([]);
    fetchBookCopies();
  }, [barcodeFilter, libraryFilter]);

  const fetchBookCopies = async () => {
    setError(null);
    try {
      const data = await fetchData(
        `/bookCopy?title=${encodeURIComponent(
          title
        )}&page=${page}&barcode=${barcodeFilter}&libraryName=${libraryFilter}`,
        "GET"
      );

      if (data.success) {
        setCopies((prevCopies) => {
          const newCopies = data.message.filter(
            (newCopy) => !prevCopies.some((copy) => copy.id === newCopy.id)
          );
          return [...prevCopies, ...newCopies];
        });
      } else {
        setCopies([]);
        toast.error(data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch book copies");
      toast.error(err.message || "Failed to fetch book copies");
    }
  };

  const fetchMoreCopies = () => {
    setPage((prevPage) => prevPage + 1);
    fetchBookCopies();
  };

  const fetchLibraries = async () => {
    try {
      const data = await fetchData("/libraries/list", "GET");
      setLibraries(data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch libraries");
    }
  };

  const handleAddCopy = async () => {
    if (!newCopy.barcode || !newCopy.libraryName) {
      toast.error("Both Barcode and Library are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetchData(
        "/bookCopy",
        "POST",
        {
          bookTitle: title,
          barcode: newCopy.barcode,
          libraryName: newCopy.libraryName,
        },
        token
      );
      toast.success("Copy added successfully");
      setShowModal(false);
      setNewCopy({ barcode: "", libraryName: "" });
      await fetchBookCopies();
    } catch (err) {
      toast.error(err.message || "Failed to add copy");
    }
  };

  const handleChangeLibrary = async (copyId, barcode, libraryName) => {
    setSelectedCopyId(copyId);
    setSelectedBarcode(barcode);
    setSelectedLibrary(libraryName);
    setShowChangeLibraryModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedLibrary && !selectedBarcode) {
      toast.error(
        "At least one attribute (Barcode or Library) must be updated"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetchData(
        `/bookCopy`,
        "PUT",
        {
          id: selectedCopyId,
          newLibrary: selectedLibrary || "",
          newBarcode: selectedBarcode || "",
        },
        token
      );
      toast.success("Attributes changed successfully");

      setCopies((prevCopies) =>
        prevCopies.map((copy) =>
          copy.id === selectedCopyId
            ? {
                ...copy,
                libraryName: selectedLibrary || copy.libraryName,
                barcode: selectedBarcode || copy.barcode,
              }
            : copy
        )
      );

      setShowChangeLibraryModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to change attributes");
    }
  };

  const handleDeleteCopy = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetchData(
        `/bookCopy?copyId=${selectedCopyId}`,
        "DELETE",
        null,
        token
      );
      toast.success("Copy deleted successfully");
      setShowDeleteModal(false);
      await fetchBookCopies();
    } catch (err) {
      toast.error(err.message || "Failed to delete copy");
    }
  };

  const openDeleteModal = (copyId) => {
    setSelectedCopyId(copyId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCopyId(null);
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Copies of {title}</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Copy
        </Button>
      </div>
      <div className="mt-3 d-flex align-items-center">
        <input
          type="text"
          name="barcode"
          id="barcode"
          placeholder="Type copy barcode"
          className="form-control me-2"
          value={barcodeFilter}
          onChange={(e) => setBarcodeFilter(e.target.value)}
        />
        <Button
          variant="secondary"
          size="sm"
          className="me-3"
          onClick={() => setBarcodeFilter("")}
        >
          Reset
        </Button>
        <select
          id="librarySelect"
          className="form-control me-2"
          value={libraryFilter}
          onChange={(e) => setLibraryFilter(e.target.value)}
        >
          <option value="">Select a library</option>
          {libraries.map((libraryName, index) => (
            <option key={index} value={libraryName}>
              {libraryName}
            </option>
          ))}
        </select>
        <Button
          variant="secondary"
          size="sm"
          className="me-3"
          onClick={() => setLibraryFilter("")}
        >
          Reset
        </Button>
      </div>

      <InfiniteScroll
        dataLength={copies.length}
        next={fetchMoreCopies}
        hasMore={copies.length % 30 === 0 && copies.length > 0}
        loader={<Loading />}
        endMessage={
          <p className="text-center my-2">There aren't more copies</p>
        }
      >
        <ul className="list-group mt-3">
          {copies.map((copy) => (
            <li
              key={copy.id}
              className="list-group-item d-flex align-items-center flex-wrap"
              style={{ padding: "10px" }}
            >
              <div className="col-md-2">
                <strong>Barcode:</strong> {copy.barcode}
              </div>
              <div className="col-md-2">
                <strong>Available:</strong>{" "}
                {copy.loanUser === "none" ? (
                  <span className="text-success">Yes</span>
                ) : (
                  <span className="text-danger">No</span>
                )}
              </div>
              <div className="col-md-3">
                <strong>Library:</strong> {copy.libraryName}
              </div>
              <div className="col-md-3">
                {copy.reserveUser !== "none" ? (
                  <span className="text-warning">
                    Reserved by: {copy.reserveUser}
                  </span>
                ) : copy.loanUser !== "none" ? (
                  <span className="text-info">Loaned to: {copy.loanUser}</span>
                ) : (
                  <span>No current reservation or loan</span>
                )}
              </div>
              <div className="col-md-2 text-end d-flex justify-content-between">
                <Button
                  variant="warning"
                  size="sm"
                  className="me-1"
                  onClick={() =>
                    handleChangeLibrary(copy.id, copy.barcode, copy.libraryName)
                  }
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDeleteModal(copy.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteCopy}
        message="Are you sure you want to delete this copy?"
      />

      {/* Add New Copy Modal */}
      <CreateCopyModal
        showModal={showModal}
        setShowModal={setShowModal}
        newCopy={newCopy}
        setNewCopy={setNewCopy}
        libraries={libraries}
        handleAddCopy={handleAddCopy}
      />

      {/* Change Library Modal */}
      <ChangeLibraryModal
        showChangeLibraryModal={showChangeLibraryModal}
        setShowChangeLibraryModal={setShowChangeLibraryModal}
        selectedLibrary={selectedLibrary}
        setSelectedLibrary={setSelectedLibrary}
        selectedBarcode={selectedBarcode}
        setSelectedBarcode={setSelectedBarcode}
        libraries={libraries}
        submitChangeLibrary={handleUpdate}
      />
    </div>
  );
}
