import clientPromise from "../lib/mongodb";
import React, { useState } from 'react';
import Router from "next/router";

export default function Proverbs({ proverbs }) {

    const [displayProverbs, setDisplayProverbs] = useState(proverbs);
    const [mainText, setMainText] = useState("");
    const [editableIndex, setEditableIndex] = useState(-1);
    const [editedText, setEditedText] = useState("");
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setMainText(searchValue);

        if (searchValue.length > 0) {
          try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchValue)}`);
            const data = await response.json();
            
            setDisplayProverbs(data);
          } catch (error) {
            console.error(error);
          }
        } else {
          setDisplayProverbs(proverbs);
        }
    };
    
    const handleAddProverb = async (text) => { 
        try {
            const response = await fetch(`/api/addProverb`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({proverb: { text: text }}),
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
    };

    const handleSaveClick = async (index) => {

        try {
          const response = await fetch(`/api/updateProverb`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: displayProverbs[index]._id, text: editedText }),
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
    };

    return (
        <>
        <div className="container">
        <div className="writing-block">
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
                Añadir Refrán
            </button>
        </div>
        <div className="display-block">
            <ul className="list">
                {displayProverbs.length > 0 ? (
                displayProverbs.map((proverb, index) => (
                    <li className="item" key={proverb._id}>
                        
                        {editableIndex === index ? (
                            <>
                            <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                            />
                            <button className="save-button" onClick={() => handleSaveClick(index)}>Guardar</button>
                            <button className="cancel-button" onClick={() => handleCancelClick(index)}>Cancelar</button>
                            </>
                        ) : (
                            <>
                            <div className="display-text">{proverb.text}</div>
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

        return {
            props: { proverbs: JSON.parse(JSON.stringify(proverbs)) },
        };

    }
    catch (e) {
        console.log(e);
        return { props: {ok: false, reason: "Server error"}};
    }
}