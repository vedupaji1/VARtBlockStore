import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../Logo.svg";

const Header = () => {
    const dispatch = useDispatch();
    const mainUserData = useSelector((state) => state.mainUserData.data);
    const usernameParameter = useSelector((state) => state.usernameParameter.data);
    const history = useHistory();

    const searchUser = async () => {
        let userEmail = document.getElementsByClassName("searchDataInp")[0].value.trim();
        if (userEmail !== "") {
            userEmail.substr(0, userEmail.indexOf("@"));
            userEmail = userEmail + "@gmail.com";
            let userData = await fetch("/getSearchedUserData", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            })
            let data = await userData.json();
            if (data.isDone === true) {
                dispatch({ type: "setSearchedUserData", payload: null })
                history.push("/" + userEmail.substr(0, userEmail.indexOf("@")))
            } else {
                alert("Your Not Exists");
            }
        } else {
            alert("Search Field Is Empty");
        }
    }

    const checkIsEnter = async (e) => {
        if (e.key === "Enter") {
            await searchUser();
        }
    };

    return (
        <>
            <div className="headerMain">
                {
                    window.innerWidth > 490 ? <div onClick={() => {
                        dispatch({ type: "setMainUserData", payload: null })
                        history.push("/")
                    }} className="headingComponent">
                        <h1 className="heading">
                            VARt<span style={{ marginLeft: "0.8rem" }}>Block</span>
                        </h1>
                    </div> : <><img onClick={() => {
                        dispatch({ type: "setMainUserData", payload: null })
                        history.push("/")
                    }} className="svgLogoShower" src={Logo} alt="" /></>
                }

                <div className="subHeader">
                    <div className="searchBarComponent">
                        <div className="searchIcon">
                            <i className="fa fa-search" aria-hidden="true" onClick={() => searchUser()}></i>
                        </div>
                        <input type="text" className="searchDataInp" placeholder="Search By Email" onKeyDown={(e) => checkIsEnter(e)} />
                    </div>
                    <div className="uploadAndUserDetails">
                        {
                            mainUserData !== null && mainUserData.isDone !== false ?
                                <>
                                    <div onClick={() => {
                                        dispatch({ type: "setIsFileUpload", payload: true })
                                    }} className="uploadSVGImg">
                                        <svg
                                            aria-label="New Post" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
                                    </div>
                                    <div onClick={() => {
                                        dispatch({ type: "setMainUserData", payload: null })
                                        history.push("/")
                                    }} className="userProfileImage">
                                        <img src={mainUserData.data.profileImage} alt="userImage" />
                                    </div>
                                </>
                                : usernameParameter !== undefined ?
                                    <div className="userProfileImage">
                                        <Link to="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB" alt="userImage" />
                                        </Link>
                                    </div> : <></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default Header; 