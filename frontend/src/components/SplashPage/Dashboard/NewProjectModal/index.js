import React, { useState } from 'react';
import { Modal } from '../../../../context/Modal';
import NewProjectForm from './NewProjectForm';

const NewProjectModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
           <button type='button' onClick={() => setShowModal(true)}>
                <i className="fa-solid fa-circle-plus"></i>
                <span>New Project</span>
            </button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <NewProjectForm setShowModal={setShowModal}/>
                </Modal>
            )}
        </>
    )
}

export default NewProjectModal;
