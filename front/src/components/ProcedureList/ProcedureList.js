import React, { useState, useEffect, useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ProcedureBox from "../ProcedureBox/ProcedureBox";
// import ProcedureInfo from "../ProcedureInfo/ProcedureInfo";
import ProcedureListCSS from "./ProcedureList.module.css";
import { UserContext } from "../../UserContext";

const url = "http://localhost:4000/api/v1/procedures";

function ProcedureList() {
    const { username } = useContext(UserContext);

    const [procedureList, setProcedureList] = useState([]);

    const [dateInput, setDateInput] = useState("");
    const [timeInput, setTimeInput] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [updateProcedure, setUpdateProcedure] = useState({});

    const [error, setError] = useState(false);

    const procedureListRef = useRef(null);

    useEffect(() => {
        fetchProcedures();
    }, []);

    const fetchProcedures = async () => {
        try {
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch procedures");
            }
            const data = await response.json();
            const procedures = data.data.procedures || [];
            setProcedureList(procedures);
        } catch (error) {
            console.error("Error fetching procedures:", error);
        }
    };

    const handleDismiss = () => {
        setEditMode(false);
        setDateInput("");
        setTimeInput("");
        setError(false);
    };

    const handleEditProcedure = (procedureId) => {
        let findProcedure = procedureList.find((procedure) => procedure._id === procedureId);
        setDateInput(findProcedure.procedureDate);
        setTimeInput(findProcedure.procedureTime);
        setEditMode(true);
        setUpdateProcedure(findProcedure);
        };

    useEffect(() => {
    }, [editMode]);

    const handleUpdateProcedure = async ({ id }) => {
        const updatedProcedure = {
            _id: id,
            releaseDate: dateInput,
            procedureTime: timeInput,
            username: username,
        };
        const response = await fetch(url + id, {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProcedure),
        });
        if (!response.ok) {
            throw new Error("Failed to update procedure");
        }
        const updatedProcedureList = procedureList.map((procedure) =>
            procedure._id === id ? updatedProcedure : procedure
        );

        setProcedureList(updatedProcedureList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
                if (
                    dateInput.length === 0 ||
                    timeInput.length === 0
                ) {
                    setError(true);
                } else {
                    await handleUpdateProcedure({ id: updateProcedure._id });
                    setError(false);
                    setEditMode(false);
                    setDateInput("");
                    setTimeInput("");
                }
        } catch (error) {
            console.error("Error adding/updating procedure:", error);
        }
    };

    // const handleDelete = async (procedureId) => {
    //     try {
    //         const response = await fetch(url + procedureId, {
    //             method: "DELETE",
    //         });
    //         if (!response.ok) {
    //             throw new Error("Failed to delete procedure");
    //         }
    //         setProcedureList(procedureList.filter((procedure) => procedure._id !== procedureId));
    //         setSelectedProcedure(procedureList[0]);
    //     } catch (error) {
    //         console.error("Error deleting procedure:", error);
    //     }
    // };

    const handleFilter = (filterOption) => {
        let filteredList = [...procedureList];
        if (filterOption === "A-Z") {
            filteredList.sort((a, b) =>
                a.procedureTitle.localeCompare(b.procedureTitle)
            );
        } else if (filterOption === "Z-A") {
            filteredList.sort((a, b) =>
                b.procedureTitle.localeCompare(a.procedureTitle)
            );
        }
        setProcedureList(filteredList);
    };

    const allProcedures = procedureList.map((procedure) => (
        <ProcedureBox
            key={uuidv4()}
            id={procedure._id}
            image={procedure.procedureImage}
            title={procedure.procedureTitle}
            category={procedure.procedureCategory}
            handleEditProcedure={handleEditProcedure}
        />
    ));

    return (
        <>

            <div
                className={ProcedureListCSS.procedureList}
                ref={procedureListRef}
            >
                <div className={`d-flex container my-4 ${ProcedureListCSS.procedureSearch}`}>
                    {/* Procedure Filter */}
                    <div className="dropdown me-4">
                        <button
                            className="btn btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Filtruoti
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={() => handleFilter("A-Z")}
                                >
                                    Pavadinimas A-Z
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={() => handleFilter("Z-A")}
                                >
                                    Pavadinimas Z-A
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={() => fetchProcedures()}
                                >
                                    Išjungti filtravimą
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Procedure List */}
                <div className="container">
                    {procedureList.length === 0 ? (
                        <p className="mb-4 ms-2">Dar nėra jokių procedūrų</p>
                    ) : (
                        <div className="row">{allProcedures}</div>
                    )}
                </div>

                {/* Pop Up */}
                <div
                        className="modal fade"
                        id="staticBackdrop"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div
                                className={`modal-content p-4 ${ProcedureListCSS.successMsg}`}
                            >
                                <div className="modal-header mx-2 border-bottom-0">
                                    <h5
                                        className="modal-title"
                                        id="exampleModalToggleLabel"
                                    >
                                        Rezervuoti procedūrą
                                    </h5>
                                    <button
                                        onClick={handleDismiss}
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <input
                                                onChange={(e) => {
                                                    setDateInput(
                                                        e.target.value
                                                    );
                                                }}
                                                type="text"
                                                id="dateInput"
                                                name="dateInput"
                                                value={dateInput}
                                                className="form-control"
                                                placeholder="Pavadinimas"
                                                maxLength="50"
                                            />
                                        </div>
                                        {error && dateInput.length <= 0 ? (
                                            <div className="Error-msg">
                                                Šis laukelis yra privalomas
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="mb-2">
                                            <input
                                                onChange={(e) =>
                                                    setTimeInput(
                                                        e.target.value
                                                    )
                                                }
                                                type="text"
                                                id="timeInput"
                                                name="timeInput"
                                                value={timeInput}
                                                className="form-control"
                                            />
                                        </div>
                                        {error && timeInput.length <= 0 ? (
                                            <div className="Error-msg">
                                                Šis laukelis yra privalomas
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="d-flex my-3 justify-content-between">
                                            <button
                                                onClick={handleDismiss}
                                                type="button"
                                                className="btn btn-outline-danger me-2"
                                                data-bs-dismiss="modal"
                                            >
                                                Atšaukti
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-outline-primary"
                                                data-bs-target={
                                                    dateInput.length <= 0 ||
                                                    timeInput.length <= 0
                                                        ? ""
                                                        : "#exampleModalToggle2"
                                                }
                                                data-bs-toggle={
                                                    dateInput.length <= 0 ||
                                                    timeInput.length <= 0
                                                        ? ""
                                                        : "modal"
                                                }
                                            >
                                                Rezervuoti
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="modal fade"
                        id="exampleModalToggle2"
                        aria-hidden="true"
                        aria-labelledby="exampleModalToggleLabel2"
                        tabIndex="-1"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div
                                className={`modal-content p-4 ${ProcedureListCSS.successMsg}`}
                            >
                                <div className="modal-header border-bottom-0">
                                    <button
                                        type="button"
                                        className={`btn-close ${ProcedureListCSS.close}`}
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body mb-4">
                                    <div
                                        className={`mb-4 ${ProcedureListCSS.successAnimation}`}
                                    >
                                        <svg
                                            className={ProcedureListCSS.checkmark}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 52 52"
                                        >
                                            <circle
                                                className={
                                                    ProcedureListCSS.checkmark__circle
                                                }
                                                cx="26"
                                                cy="26"
                                                r="25"
                                                fill="none"
                                            />
                                            <path
                                                className={
                                                    ProcedureListCSS.checkmark__check
                                                }
                                                fill="none"
                                                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                            />
                                        </svg>
                                    </div>
                                    <p className="F-size-25 Roboto-condensed text-center">
                                        Procedūros rezervacija pavyko
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
        </>
    );
}

export default ProcedureList;
