import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import ThreeDotsButton from '../ThreeDotsButton';
import { editProject, deleteProject } from '../../../../../store/myProjects';

const ProejctInfo = ({ params, isMyProject, projectId, currentProject }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [ errors, setErrors ] = useState([]);
    const [ projectName, setProjectName ] = useState('');
    const [ projectDescription, setProjectDescription ] = useState('');
    const [ viewOnlyMode, setViewOnlyMode ] = useState(true);
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false);

    useEffect(() => {
        if (currentProject) {
            setProjectName(currentProject.name);
            setProjectDescription(currentProject.description);
        }
      }, [currentProject]);

    const showEditForm = e => {
        e.preventDefault();
        setViewOnlyMode(false);
    }

    const closeEditForm = e => {
        e.preventDefault();
        setProjectName(currentProject.name);
        setProjectDescription(currentProject.description);
        setErrors([]);
        setViewOnlyMode(true);
    }

    const showDeleteButton = e => {
        e.preventDefault();
        setShowConfirmDelete(true);
    }

    const hideDeleteButton = e => {
        e.preventDefault();
        setShowConfirmDelete(false);
    }

    const handleEdit = e => {
        e.preventDefault();
        setErrors([]);
        dispatch(editProject(projectId, projectName.trim(), projectDescription.trim()))
        .then(() => {
            setViewOnlyMode(true);
            history.push(`/${params.username}/${projectName}`);
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    }

    const handleDelete = e => {
        e.preventDefault();
        dispatch(deleteProject(projectId))
        .then(async (res) => {
            const message = await res.json();
            if (message === 'success') history.push('/');
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    }

    return (
        <>
            <div className='main-content-title'>
                <h2>Project info</h2>
                { isMyProject &&
                    <ThreeDotsButton thisElement='project' showEditForm={showEditForm} showDeleteButton={showDeleteButton}/>
                }
            </div>
            <div className='main-content-card project-info'>
                {showConfirmDelete &&
                    <div className='confirm-delete'>
                        <p id='confirm-delete-text'>Are you sure you want to permanently delete this project?</p>
                        <button type='button' onClick={hideDeleteButton}>Maybe later</button>
                        <button className='delete' type='button' onClick={handleDelete}>Confirm delete</button>
                    </div>
                }
                <form onSubmit={handleEdit}>
                    <div className="input-container-name">
                        <label htmlFor="edit-project-name-input">
                            Project name
                        </label>
                        <input
                        id="new-project-name-input"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        disabled={viewOnlyMode}
                        required
                        />
                    </div>
                    <div className="input-container-description">
                        <label htmlFor="edit-project-description-input">
                            Description
                        </label>
                        <textarea
                        id="new-project-description-input"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        disabled={viewOnlyMode}
                        />
                    </div>
                    <ul>
                        {errors.map((error, idx) => <li className="error-message" key={idx}>{error}</li>)}
                    </ul>
                    {!viewOnlyMode &&
                        <div className='btn-group'>
                            <button className='cancel' type="button" onClick={closeEditForm}>Cancel</button>
                            <button className='submit' type="submit">Save</button>
                        </div>
                    }
                </form>
            </div>
        </>
    )
}
export default ProejctInfo;
