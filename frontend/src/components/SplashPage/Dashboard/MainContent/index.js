import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import './MainContent.css';
import { deleteProject } from '../../../../store/myProjects';

const MainContent = ({ params }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const myProjects = useSelector((state) => state.myProjects);
    const myProjectsArray = Object.values(myProjects);
    const [ projectId, setProjectId ] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        myProjectsArray.forEach(project => {
            if (project.name === params.projectName) setProjectId(project.id);
        })
    }, [params]);

    const handleEdit = e => {
        e.preventDefault();
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
        <div className='dashboard-main'>
            <ul>
                {errors.map((error, idx) => <li className="error-message" key={idx}>{error}</li>)}
            </ul>
            {params.username && params.projectName &&
                <>
                    <h1>{`${params.username}----${params.projectName}`}</h1>
                    <button type='button' onClick={handleEdit}>Edit</button>
                    <button type='button' onClick={handleDelete}>Delete</button>
                </>
            }
        </div>
    )
}
export default MainContent;
