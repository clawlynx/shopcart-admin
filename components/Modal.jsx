import React from "react";

export default function Modal({
  itemToDelete,
  cancelDelete,
  confirmDelete,
  state1,
}) {
  return (
    <aside className="popup-container">
      <div className="popup">
        <h4>
          Are you sure want to delete the category{" "}
          <span className=" font-bold">{itemToDelete.categoryName}</span>?
        </h4>
        <div className="popup-btn-container">
          <button
            type="button"
            onClick={() => confirmDelete(state1)}
            className="btn-red confirm-btn"
          >
            confirm
          </button>
          <button
            type="button"
            onClick={() => cancelDelete()}
            className="btn-primary clear-btn"
          >
            cancel
          </button>
        </div>
      </div>
    </aside>
  );
}
