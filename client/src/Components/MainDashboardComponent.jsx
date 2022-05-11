import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Error404 from "./Error404";
import Dashboard from "./Dashboard/Dashboard";
import Loading from "./Loading";
import UploadFile from './Header/UploadFile';
const MainDashboardComponent = () => {
    let { username } = useParams();
    const dispatch = useDispatch();
    const mainUserData = useSelector((state) => state.mainUserData.data);
    const searchedUserData = useSelector((state) => state.searchedUserData.data);
    const is404 = useSelector((state) => state.is404.data);
    const usernameParameter = useSelector((state) => state.usernameParameter.data);
    const isLoading = useSelector((state) => state.isLoading.data);
    const isFileUpload = useSelector((state) => state.isFileUpload.data);
    useEffect(() => {
        const init = async () => {
            try {
                if (usernameParameter !== username) {
                    dispatch({ type: "setUsernameParameter", payload: username });
                }
                if (mainUserData === null) {
                    dispatch({ type: "setIsLoading", payload: true })
                    let userData = await fetch("/getUserData")
                    let data = await userData.json();
                    dispatch({ type: "setMainUserData", payload: data })
                    dispatch({ type: "setUsersData_PRIVATE", payload: [{ path: "/root", data: data.data.privateFiles }] });
                    dispatch({ type: "setUsersData_PUBLIC", payload: [{ path: "/root", data: data.data.publicFiles }] });
                    dispatch({ type: "setIsLoading", payload: false })
                } else if (mainUserData.isDone === false) {
                    window.location.href = "/auth/google";
                    // window.location.href = "/auth/google";
                }
                if (username !== undefined) {
                    if (searchedUserData === null) {
                        let userData = await fetch("/getSearchedUserData", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: username + "@gmail.com" })
                        })
                        let data = await userData.json();
                        dispatch({ type: "setSearchedUserData", payload: data })
                        dispatch({ type: "setUsersData_PUBLIC", payload: [{ path: "/root", data: data.data.publicFiles }] });
                    } else if (searchedUserData.isDone === false && is404 === false) {
                        dispatch({ type: "setIs404", payload: true });
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        init();
    })

    return (
        <>
            {
                username === undefined ?
                    mainUserData !== null ? <Dashboard usersData={mainUserData} isMainUser={true} /> : <></>
                    : searchedUserData !== null ? <Dashboard usersData={searchedUserData} isMainUser={false} /> : <></>
            }
            {
                is404 === true ? <Error404 /> : <></>
            }
            {
                isFileUpload === true ? <UploadFile /> : <></>
            }
            {
                isLoading === true ? <Loading /> : <></>
            }
        </>
    )
}

export default MainDashboardComponent;