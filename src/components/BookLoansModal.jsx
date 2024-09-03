import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const BookLoansModal = ({ usersLoans }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Show Users Loans
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Users Loans</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {usersLoans.map((loan, index) => (
              <li key={index}>{loan}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookLoansModal;
