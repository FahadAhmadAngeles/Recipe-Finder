import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "../style/reviewButtons.css";

const ReviewButtons = ({ reviewData, onEdit, onDelete }) => {
  return (
    <div className="review-buttons-container">
      <button
        className="review-btn edit-btn"
        onClick={() => onEdit(reviewData)}
        title="Edit Review"
      >
        EDIT <FontAwesomeIcon icon={faPenToSquare} className="icon" />
      </button>

      <button
        className="review-btn delete-btn"
        onClick={() => onDelete(reviewData._id)}
        title="Delete Review"
      >
        DELETE <FontAwesomeIcon icon={faTrashCan} className="icon" />
      </button>
    </div>
  );
};

export default ReviewButtons;
