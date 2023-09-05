import clientPromise from "../lib/mongodb";
import { useState } from 'react';
import Router from "next/router";

export default function Proverbs({ proverbs }) {

    const [displayProverbs, setDisplayProverbs] = useState(proverbs);
    const [mainText, setMainText] = useState("");
    const [editableIndex, setEditableIndex] = useState(-1);
    const [editedText, setEditedText] = useState("");

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

    const handleDeleteClick = async (_id) => {
        try {
            const response = await fetch(`/api/deleteProverb`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id: _id}),
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

    return (
        <>
        <input
            type="text"
            placeholder="Añade un refrán"
            className="input"
            onChange={handleSearch}
        >

        </input>
        <button
            className="add"
            onClick={() => handleAddProverb(mainText)}
        >
            Añadir Refrán
        </button>
        <ul className="list">
            {displayProverbs.length > 0 ? (
            displayProverbs.map((proverb, index) => (
                <li key={proverb._id}>
                    
                    {editableIndex === index ? (
                        <>
                        <input
                            type="text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                        />
                        <button onClick={() => handleSaveClick(index)}>Guardar</button>
                        </>
                    ) : (
                        <>
                        <span>{proverb.text}</span>
                        <button onClick={() => handleEditClick(index)}>Editar</button>
                        </>
                    )}
   
                    <button
                        className="delete"
                        onClick={() => handleDeleteClick(proverb._id)}
                    >
                        Borrar
                    </button>
                </li>
            ))
            ) : (
            <li>No se han encontrado resultados</li>
            )}
        </ul>
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