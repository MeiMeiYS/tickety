import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import NewProjectModal from '../NewProjectModal';

const Navbar = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const projects = useSelector((state) => state.projects);
    const projectsArray = Object.entries(projects);


    return (
        <div className='dashboard-navbar'>
            <div className='nav-btn-group'>
                <NavLink exact to="/">
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink exact to="/accounts/setting">
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </NavLink>
                <NewProjectModal />
            </div>
            <div className='nav-projects-button-group'>
                <span>My Projects</span>
                { projectsArray.length ? projectsArray.map(subArr => {
                    return (
                    <NavLink key={`project-${subArr[1].id}`} exact to={`/${sessionUser.username}/${subArr[1].name}`}>
                        <i className="fa-solid fa-circle" style={{ fontSize: '0.5rem'}}></i>
                        <span>{subArr[1].name}</span>
                    </NavLink>)
                }) : <span>You have no project yet.</span>}
            </div>
        </div>
    )
}

export default Navbar;
