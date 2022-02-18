import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './NewProjectForm.css';
import { createProject } from '../../../../store/myProjects';

const NewProjectForm = ({ setShowModal }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(createProject(sessionUser.id, name, description))
            .then(() => setShowModal(false))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
        return
    }
    return (
        <div className="new-project-form-box">
            <h1>New Project</h1>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="input-container-name">
                    <label htmlFor="new-project-name-input">
                        Project name
                    </label>
                    <input
                    id="new-project-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>
                <div className="input-container-description">
                    <label htmlFor="new-project-description-input">
                        Description
                    </label>
                    <textarea
                    id="new-project-description-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <ul>
                    {errors.map((error, idx) => <li className="error-message" key={idx}>{error}</li>)}
                </ul>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default NewProjectForm;
