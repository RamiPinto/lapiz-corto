import clientPromise from "../lib/mongodb";
import React, { useState } from 'react';
import Router from "next/router";

export default function Proverbs({ proverbs, count }) {

    const [displayProverbs, setDisplayProverbs] = useState(proverbs);
    const [mainText, setMainText] = useState("");
    const [editableIndex, setEditableIndex] = useState(-1);
    const [editedText, setEditedText] = useState("");
    const [editedWritten, setEditedWritten] = useState(false);
    const [editedOwner, setEditedOwner] = useState("");
    const [showNewOnly, setShowNewOnly] = useState(false);
    const [proverbCount, setProverbCount] = useState(count);

    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [isOwnerVisible, setOwnerVisible] = useState(false);

    const [deleteItemId, setDeleteItemId] = useState(null);

    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setMainText(searchValue);

        if (searchValue.length > 0) {
          try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchValue)}`);
            const data = await response.json();
            
            setDisplayProverbs(data);
            setProverbCount(data.length);
          } catch (error) {
            console.error(error);
          }
        } else {
          setDisplayProverbs(proverbs);
          setProverbCount(count);
        }
    };

    const handleAddProverb = async () => { 
        setOwnerVisible(true);
    };
    
    const handleConfirmAddClick = async () => { 
        try {
            const response = await fetch(`/api/addProverb`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({proverb: { text: mainText, owner: editedOwner }}),
            });
            if (response.ok) {
                console.log('Proverb added successfully');
                Router.reload();
            } else {
                console.error('Error adding proverb');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleCancelAddClick = async () => { 
        setOwnerVisible(false);
        setEditedOwner("");
    };

    const handleDeleteClick = (_id) => {
        setConfirmVisible(true);
        setDeleteItemId(_id);
    };

    const handleCancelDeleteClick = () => {
        setConfirmVisible(false);
        setDeleteItemId(null);
    };

    const handleConfirmDeleteClick = async () => {
        try {
            const response = await fetch(`/api/deleteProverb`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id: deleteItemId}),
            });
            if (response.ok) {
                console.log('Proverb deleted successfully');
                Router.reload();
            } else {
                console.error('Error deleting proverb');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (index) => {
        setEditableIndex(index);
        setEditedText(displayProverbs[index].text); // Initialize with current text
        setEditedWritten(displayProverbs[index].written); // Initialize with current written
        setEditedOwner(displayProverbs[index].owner); // Initialize with current owner
    };

    const handleSaveClick = async (index) => {

        try {
          const response = await fetch(`/api/updateProverb`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: displayProverbs[index]._id, text: editedText, written: editedWritten, owner: editedOwner }),
          });
    
          if (response.ok) {
            setEditableIndex(-1);
            Router.reload();

          } else {
            console.error('Error updating item');
          }
        } catch (error) {
          console.error(error);
        }
    };

    const handleCancelClick = async (index) => { 
        setEditableIndex(-1);
        setEditedText("");
        setEditedWritten(false);
        setEditedOwner("");
    };

    const handleShowNewChange = () => {
        setShowNewOnly(!showNewOnly);

        // Filter the proverbs based on the checkbox status
        if (!showNewOnly) {
          // If the checkbox is checked, filter only unwritten proverbs
          const newProverbs = proverbs.filter(proverb => !proverb.written);
          setDisplayProverbs(newProverbs);
          setProverbCount(newProverbs.length);
        } else {
          // If the checkbox is unchecked, show all proverbs
          setDisplayProverbs(proverbs);
          setProverbCount(count);
        }
      };

    return (
        <>
        <div className="container">
        <div className="writing-block">
            {
                displayProverbs[0]?.score > 5 ? 
                <p className="duplicate-tag">POSIBLE DUPLICADO</p>
                : null
            }
            <textarea
                placeholder="Añade un refrán"
                onChange={handleSearch}
            >
            </textarea>
            <button
                className="add"
                onClick={() => handleAddProverb(mainText)}
                disabled={mainText === ""}
            >
                Añadir
            </button>
            <div className="wrapper">
                <div className="filter">
                    <span>Mostrar nuevos </span>
                    <input
                        type="checkbox"
                        checked={showNewOnly}
                        onChange={handleShowNewChange}
                    />
                </div>
                <div className="count">{proverbCount} refranes encontrados</div>
            </div>
        </div>
        <div className="display-block">
            <ul className="list">
                {displayProverbs.length > 0 ? (
                displayProverbs.map((proverb, index) => (
                    <li className="item" key={proverb._id}>
                        
                        {editableIndex === index ? (
                            <>
                            <div className="is-new">
                                <span>Registrado </span>
                                <input
                                    type="checkbox"
                                    checked={editedWritten}
                                    onChange={(e) => setEditedWritten(e.target.checked)}
                                />
                            </div>
                            <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                            />
                            <input
                                type="text"
                                className="owner-edit"
                                value={editedOwner}
                                onChange={(e) => setEditedOwner(e.target.value)}
                            />
                            <button className="save-button" onClick={() => handleSaveClick(index)}>Guardar</button>
                            <button className="cancel-button" onClick={() => handleCancelClick(index)}>Cancelar</button>
                            </>
                        ) : (
                            <>
                            {
                                proverb.written ? 
                                null
                                : <div className="new-tag">NUEVO</div>
                            }
                            <div className="display-text"><div id="display-text-child">"{proverb.text}"</div></div>
                            <div className="owner-text">{proverb.owner}</div>
                            <button className="edit-button" onClick={() => handleEditClick(index)}>Editar</button>
                            </>
                        )}
    
                        <button
                            className="delete-button"
                            onClick={() => handleDeleteClick(proverb._id)}
                        >
                            Borrar
                        </button>
                    </li>
                ))
                ) : (
                <li className="no-result">No se han encontrado resultados</li>
                )}
            </ul>
        </div>
        </div>
        {/* Confirmation Popup */}
        {isConfirmVisible && (
            <div className="confirmation-popup">
                <div className="confirmation-popup-content">
                <p>¿Seguro que quieres borrar este refrán?</p>
                <button onClick={handleConfirmDeleteClick}>Sí</button>
                <button onClick={handleCancelDeleteClick}>No</button>
                </div>
            </div>
        )}
        {/* Owner Popup */}
        {isOwnerVisible && (
            <div className="owner-popup">
                <div className="owner-popup-content">
                <p>¿Quién ha recordado este refrán?</p>
                <input
                    type="text"
                    placeholder="Escribe aquí"
                    onChange={(e) => setEditedOwner(e.target.value)}
                />
                <button 
                    onClick={handleConfirmAddClick}
                    disabled={editedOwner === ""}
                >
                    Guardar
                </button>
                <button onClick={handleCancelAddClick}>Cancelar</button>
                </div>
            </div>
        )}
        </>
    );
}

export async function getServerSideProps() {
    try{

        const client = await clientPromise;
        const db = client.db("lapizcorto");

        const proverbs = await db
            .collection("proverbs")
            .find({})
            .sort({text: 1})
            .toArray();
        
        const count = await db
            .collection("proverbs")
            .countDocuments({}, { hint: "_id_" });

        return {
            props: { proverbs: JSON.parse(JSON.stringify(proverbs)), count: JSON.parse(JSON.stringify(count)) },
        };

    }
    catch (e) {
        console.log(e);
        return { props: {ok: false, reason: "Server error"}};
    }
}