import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const UsersLoansModal = ({ usersLoans, onReturnLoan }) => {
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
          {usersLoans.length > 0 ? (
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {usersLoans.map((loan, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{loan}</span>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onReturnLoan(loan)}
                  >
                    Return Loan
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No loans available.</p>
          )}
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

export default UsersLoansModal;
