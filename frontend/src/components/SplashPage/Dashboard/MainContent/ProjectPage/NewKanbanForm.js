import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createKanban } from '../../../../../store/kanbans';
import { fetchOneProjectsById } from '../../../../../store/myProjects';

const NewKanbanForm = ({ setShowNewKanbanForm, currentProject }) => {
    const dispatch = useDispatch();
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ errors, setErrors ] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(createKanban(currentProject.id, name.trim(), description.trim()))
            .then((res) => {
                setShowNewKanbanForm(false);
                // update myProject redux store
                dispatch(fetchOneProjectsById(currentProject.id));
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
        return
    }

    return (
        <>
            <button className='new-kanban-btn active' type='button' onClick={e => setShowNewKanbanForm(false)}>
                <i className="fa-solid fa-circle-minus"></i>
                <span>New Kanban</span>
            </button>
            <form onSubmit={handleSubmit} className='new-kanban-form'>
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
                    <button className='cancel' type="button" onClick={e => setShowNewKanbanForm(false)}>Cancel</button>
                    <button className='submit' type="submit">Save</button>
                </div>
            </form>
        </>
    )
}

export default NewKanbanForm;
