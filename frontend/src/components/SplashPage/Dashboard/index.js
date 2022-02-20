import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './Dashboard.css';
import Navbar from './Navbar';
import MainContent from './MainContent';
import { fetchAllMyProjects } from '../../../store/myProjects';

const Dashboard = ({ params }) => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [navbarShowing, setNavbarShowing] = useState(true);
    console.log(navbarShowing)

    useEffect(() => {
        dispatch(fetchAllMyProjects()).then(() => setIsLoaded(true));
    }, [dispatch]);


    return (
        <>
            {isLoaded &&
                <div className='dashboard-content'>
                    <Navbar navbarShowing={navbarShowing}/>
                    <button type="button" className={`navbar-switch-btn ${navbarShowing ? '' : 'hidden-state'}`} onClick={ e => setNavbarShowing(preState => !preState)}>
                        {navbarShowing ? <i className="fa-solid fa-angle-left"></i> : <i className="fa-solid fa-angle-right"></i>}
                    </button>
                    <MainContent params={params}/>
                </div>
            }
        </>
    )
}

export default Dashboard;
