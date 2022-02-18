import { useSelector } from 'react-redux';
import SplashPageContent from './SplashPageContent';
import DashBoard from './Dashboard'
import Footer from '../Footer';

const SplashPage = ({ display }) => {
    const sessionUser = useSelector(state => state.session.user);
    return (
        <>
            { sessionUser ?
            <DashBoard display={display} /> :
            <>
                <SplashPageContent />
                <Footer />
            </>}
        </>
    )
}

export default SplashPage;
