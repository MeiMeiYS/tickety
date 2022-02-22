import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ThreeDotsButton from '../ThreeDotsButton';
import { editKanban, deleteKanban } from '../../../../../store/kanbans';
import { fetchOneProjectsById } from '../../../../../store/myProjects';

const EachKanbanCard = ({ kanban, params }) => {
    const dispatch = useDispatch();
    const [ errors, setErrors ] = useState([]);
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ viewOnlyMode, setViewOnlyMode ] = useState(true);
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false);

    useEffect(() => {
        if (kanban) {
            setName(kanban.name);
            setDescription(kanban.description);
        }
      }, [kanban]);

    const showEditForm = e => {
        e.preventDefault();
        setViewOnlyMode(false);
    }

    const closeEditForm = e => {
        e.preventDefault();
        setViewOnlyMode(true);
        setName(kanban.name);
        setDescription(kanban.description);
    }

    const showDeleteButton = e => {
        e.preventDefault();
        setShowConfirmDelete(true);
    }

    const hideDeleteButton = e => {
        e.preventDefault();
        setShowConfirmDelete(false);
    }

    const handleUpdateKanban = e => {
        e.preventDefault();
        dispatch(editKanban(kanban.project_id, kanban.id, name.trim(), description.trim()))
        .then(() => {
            setViewOnlyMode(true);
            // update myProject redux store
            dispatch(fetchOneProjectsById(kanban.project_id));
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });

    }

    const handleDelete = e => {
        e.preventDefault();
        dispatch(deleteKanban(kanban.id))
        .then(async (res) => {
            setShowConfirmDelete(false);
            // update myProject redux store
            dispatch(fetchOneProjectsById(kanban.project_id));
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    }

    return (
        <>
            <div key={`kanban-${kanban.id}`} className='kanban-details'>
                <div className='left'>
                {showConfirmDelete &&
                    <div className='confirm-delete'>
                        <p id='confirm-delete-text'>Are you sure you want to permanently delete this kanban?</p>
                        <button type='button' onClick={hideDeleteButton}>Maybe later</button>
                        <button className='delete' type='button' onClick={handleDelete}>Confirm delete</button>
                    </div>
                }
                { viewOnlyMode ?
                    <>
                        <NavLink exact to={`/${params.username}/${params.projectName}/${kanban.id}`}>{kanban.name}</NavLink>
                        <p>{kanban.description}</p>
                    </>
                    :
                    <form onSubmit={handleUpdateKanban} className='edit-kanban-form'>
                        <div className="input-container-name">
                            <label htmlFor="new-project-name-input">
                                Kanban name
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
                        <div className='btn-group'>
                            <button className='cancel' type="button" onClick={closeEditForm}>Cancel</button>
                            <button className='submit' type="submit">Save</button>
                        </div>
                    </form>
                }
                </div>
                <div className='right'>
                    <ThreeDotsButton thisElement={'kanban'} showEditForm={showEditForm} showDeleteButton={showDeleteButton}/>
                </div>
            </div>
        </>
    )
}

export default EachKanbanCard;
