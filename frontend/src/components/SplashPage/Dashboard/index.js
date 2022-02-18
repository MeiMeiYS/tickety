import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './Dashboard.css';
import Navbar from './Navbar';
import { fetchAllProjects } from '../../../store/projects';

const Dashboard = ({ display }) => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(fetchAllProjects()).then(() => setIsLoaded(true));
    }, [dispatch]);


    return (
        <>
            {isLoaded &&
                <div className='dashboard-content'>
                    <Navbar />
                    <div className='dashboard-main'>
                        {display === 'dashboard' && <h1>{display}</h1>}
                    </div>
                </div>
            }
        </>
    )
}

export default Dashboard;
