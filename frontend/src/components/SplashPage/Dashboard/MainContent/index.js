import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MainContent.css';
import ProjectPage from './ProjectPage';

const MainContent = ({ params }) => {
    const myProjects = useSelector((state) => state.myProjects);
    const sessionUser = useSelector((state) => state.session.user);
    const myProjectsArray = Object.values(myProjects);
    const [ projectId, setProjectId ] = useState('');
    const [ isMyProject, setIsMyProject ] = useState(false);

    useEffect(() => {
        //set projectId
        myProjectsArray.forEach(project => {
            if (project.name === params.projectName) setProjectId(project.id);
        })
        //check if username is current user
        if (params.username === sessionUser.username) setIsMyProject(true);

    }, [params]);



    return (
        <div className='dashboard-main'>
            {params.username && params.projectName &&
                <ProjectPage params={params} isMyProject={isMyProject} projectId={projectId}/>
            }
        </div>
    )
}
export default MainContent;
