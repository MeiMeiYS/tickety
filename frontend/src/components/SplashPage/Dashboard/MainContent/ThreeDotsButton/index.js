import React, { useState, useEffect } from "react";
import './ThreeDotsButton.css';

const ThreeDotsButton = ({ thisElement, showEditForm, showDeleteButton }) => {
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    return (
        <div id='edit-btn' onClick={openMenu}>
            <button type='button' >
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            {showMenu && (
                <div className="edit-dropdown">
                    <button onClick={showEditForm}>Edit {thisElement}</button>
                    <button className="delete-btn" onClick={showDeleteButton}>Delete {thisElement}</button>
                </div>
            )}
        </div>
    )
}
export default ThreeDotsButton;
