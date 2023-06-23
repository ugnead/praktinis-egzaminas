import React from "react";
import ProcedureBoxCSS from "./ProcedureBox.module.css";

function ProcedureBox(props) {
    let { id, image, title, category, handleEditProcedure } = props;

    return (
        <>
            <div className={`card col m-1 ${ProcedureBoxCSS.box}`}>
                <img src={image} className="card-img-top" alt={title} />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p>Kategorija: {category}</p>
                    <button
                        onClick={() => handleEditProcedure(id)}
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        className="btn btn-primary"
                    >
                        Rezervuoti
                    </button>
                </div>
            </div>
        </>
    );
}

export default ProcedureBox;
