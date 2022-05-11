import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMoreVertical } from "react-icons/fi";

const Dashboard = ({ usersData, isMainUser }) => {
    let usersData_PRIVATE = useSelector((state) => state.usersData_PRIVATE.data);
    let usersData_PUBLIC = useSelector((state) => state.usersData_PUBLIC.data);
    let tempCounter_PRIVATE = useRef(0);
    let tempCounter_PUBLIC = useRef(0);
    let folderNames_PRIVATE = [];
    let folderNames_PUBLIC = [];
    let shouldShowData = false;
    const dispatch = useDispatch();

    const changeAccountVisibility = async (isPrivate) => {
        if (window.confirm("Are You Sure, Your Account's Visibility Will Change") === true) {
            dispatch({ type: "setIsLoading", payload: true });
            let resData = await fetch("/setAccountVisibility", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPrivate: isPrivate })
            })
            let data = await resData.json();
            if (data.isDone === true) {
                alert("Visibility Of Account Is Changed");
            } else {
                alert("Something Went Wrong");
            }
            window.location.reload();
        }
    }

    const isFile = (filePath, isPrivate) => {
        shouldShowData = false;
        if (isPrivate === true) {
            if (filePath.split("/").length - 1 > tempCounter_PRIVATE.current) {
                if (folderNames_PRIVATE.indexOf(filePath.split("/")[tempCounter_PRIVATE.current]) === -1) {
                    folderNames_PRIVATE.push(filePath.split("/")[tempCounter_PRIVATE.current])
                    shouldShowData = true;
                }
                return false;
            } else {
                shouldShowData = true;
                return true;
            }
        } else {
            shouldShowData = false;
            if (filePath.split("/").length - 1 > tempCounter_PUBLIC.current) {
                if (folderNames_PUBLIC.indexOf(filePath.split("/")[tempCounter_PUBLIC.current]) === -1) {
                    folderNames_PUBLIC.push(filePath.split("/")[tempCounter_PUBLIC.current])
                    shouldShowData = true;
                }
                return false;
            } else {
                shouldShowData = true;
                return true;
            }
        }
    }

    const changeCurrentFolder = (folderName, isPrivate) => {
        let tempData = [];
        let tempMainData;
        if (isPrivate === true) {
            for (let i = 0; i < usersData_PRIVATE[tempCounter_PRIVATE.current].data.length; i++) {
                if (usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath.split("/")[tempCounter_PRIVATE.current] === folderName) {
                    tempData.push((usersData_PRIVATE[tempCounter_PRIVATE.current].data[i]))
                }
            }
            tempMainData = usersData_PRIVATE;
            tempMainData = Object.assign([], tempMainData);
            tempMainData.push({ path: "/" + folderName, data: tempData })
            tempCounter_PRIVATE.current += 1
            dispatch({ type: "setUsersData_PRIVATE", payload: tempMainData });
        } else {
            for (let i = 0; i < usersData_PUBLIC[tempCounter_PUBLIC.current].data.length; i++) {
                if (usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath.split("/")[tempCounter_PUBLIC.current] === folderName) {
                    tempData.push((usersData_PUBLIC[tempCounter_PUBLIC.current].data[i]))
                }
            }
            tempMainData = usersData_PUBLIC;
            tempMainData = Object.assign([], tempMainData);
            tempMainData.push({ path: "/" + folderName, data: tempData })
            tempCounter_PUBLIC.current += 1
            dispatch({ type: "setUsersData_PUBLIC", payload: tempMainData });
        }
    }

    const changeCurPath = (pos, isPrivate) => {
        if (isPrivate === true) {
            tempCounter_PRIVATE.current = pos;
            let tempMainData = usersData_PRIVATE;
            tempMainData = Object.assign([], tempMainData);
            tempMainData = tempMainData.splice(0, tempCounter_PRIVATE.current + 1)
            dispatch({ type: "setUsersData_PRIVATE", payload: tempMainData });
        } else {
            tempCounter_PUBLIC.current = pos;
            let tempMainData = usersData_PUBLIC;
            tempMainData = Object.assign([], tempMainData);
            tempMainData = tempMainData.splice(0, tempCounter_PUBLIC.current + 1)
            dispatch({ type: "setUsersData_PUBLIC", payload: tempMainData });
        }
    }

    const getFileIndex = (filePath, dataFile) => {
        return new Promise((res, rej) => {
            for (let i = 0; i < dataFile.length; i++) {
                if (filePath === dataFile[i].filePath) {
                    res(i);
                }
            }
        })
    }

    const shareFileLink = async (filePath, isPrivate) => {
        let fileIndex;
        if (isPrivate === true) {
            fileIndex = await getFileIndex(filePath, usersData_PRIVATE[0].data);
            await navigator.clipboard.writeText(usersData_PRIVATE[0].data[fileIndex].link);
        } else {
            fileIndex = await getFileIndex(filePath, usersData_PUBLIC[0].data);
            await navigator.clipboard.writeText(usersData_PUBLIC[0].data[fileIndex].link);
        }
        alert("Link Is Copied To Your Clipboard");
    }

    const changeFileVisibility = async (filePath, isPrivate) => {
        if (window.confirm("Are You Sure, Your File's Visibility Will Change") === true) {
            let fileIndex;
            if (isPrivate !== true) {
                fileIndex = await getFileIndex(filePath, usersData_PRIVATE[0].data);
            } else {
                fileIndex = await getFileIndex(filePath, usersData_PUBLIC[0].data);
            }
            console.log(fileIndex)
            dispatch({ type: "setIsLoading", payload: true });
            let resData = await fetch("/setFileVisibility", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPrivate: isPrivate, index: fileIndex })
            })
            let data = await resData.json();
            if (data.isDone === true) {
                alert("Visibility Of File Is Changed");
            } else {
                alert("Something Went Wrong");
            }
            window.location.reload();
        }
    }

    const deleteFile = async (filePath, isPrivate) => {
        if (window.confirm("Are You Sure, Your File Will Deleted") === true) {
            let fileIndex;
            if (isPrivate === true) {
                fileIndex = await getFileIndex(filePath, usersData_PRIVATE[0].data);
            } else {
                fileIndex = await getFileIndex(filePath, usersData_PUBLIC[0].data);
            }
            console.log(fileIndex)
            dispatch({ type: "setIsLoading", payload: true });
            let resData = await fetch("/deleteFileData", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPrivate: isPrivate, index: fileIndex })
            })
            let data = await resData.json();
            if (data.isDone === true) {
                alert("Your File Is Deleted");
            } else {
                alert("Something Went Wrong");
            }
            window.location.reload();
        }
    }

    const getProperDate = (unfilteredDate) => {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let tempDate = new Date(unfilteredDate);
        let curDate = new Date();
        if (curDate.getFullYear() > tempDate.getFullYear()) {
            return tempDate.getDate() + months[tempDate.getMonth()] + " " + tempDate.getFullYear();
        } else if (curDate.getMonth() > tempDate.getMonth() || curDate.getDate() > tempDate.getDate()) {
            return tempDate.getDate() + " " + months[tempDate.getMonth()];
        } else {
            return tempDate.getHours() + ":" + tempDate.getMinutes();
        }
    }

    return (
        <>
            {
                usersData === undefined || usersData === null || usersData.isDone === false ? <></>
                    : usersData_PRIVATE === null && usersData_PUBLIC === null ? <></>
                        : <>
                            <div className="mainDashboardComponent">
                                <div className="subDashboardComponent">
                                    <div className="profileShowerComponent">
                                        <div className="profileImage">
                                            <img src={usersData.data.profileImage} alt="profileImage" />
                                        </div>
                                        <div className="usersDetails">
                                            <h1 className="usernameData">{usersData.data.username}</h1>
                                            <p className="userEmailData">{usersData.data.email}</p>
                                            {
                                                usersData.data.isPrivate === true ? <p className="accountVisibilityShower"><span className="circleShape" style={{ backgroundColor: "red" }}></span> Private</p>
                                                    : <p className="accountVisibilityShower"><span className="circleShape" style={{ backgroundColor: "green" }}></span> Public</p>
                                            }

                                            {
                                                isMainUser === true ?
                                                    usersData.data.isPrivate === true ? <>
                                                        <div onClick={() => changeAccountVisibility(false)} className="visibilityChanger" style={{ color: "green" }}>Public</div>
                                                        <div onClick={() => {
                                                            window.location.href = "/auth/google";
                                                        }} className="switchAccountShower">Switch Account</div>
                                                    </>
                                                        : <>
                                                            <div onClick={() => changeAccountVisibility(true)} className="visibilityChanger" style={{ color: "#cf222e" }}>Private</div>
                                                            <div onClick={() => {
                                                               window.location.href = "/auth/google";
                                                            }} className="switchAccountShower">Switch Account</div>
                                                        </>
                                                    : <></>
                                            }
                                        </div>
                                    </div>

                                    <div className="fileShowerComponent">
                                        {
                                            isMainUser === true ?
                                                <div className="privateFileShower">
                                                    <div className="fileShowerHeading">
                                                        <span className="circleShape" style={{ backgroundColor: "red" }}></span>
                                                        <h1>Private</h1>
                                                        <div className="pathShower">
                                                            {
                                                                usersData_PRIVATE[0].data.length > 0 ?
                                                                    usersData_PRIVATE.map((data, i) => (
                                                                        <span key={i} onClick={() => changeCurPath(i, true)}>{usersData_PRIVATE[i].path}</span>
                                                                    )) : <>No Files</>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        usersData_PRIVATE[tempCounter_PRIVATE.current].data.map((data, i) => (
                                                            isFile(usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath, true) === true ?
                                                                shouldShowData === true ?
                                                                    <div key={i} className="fileShowerDiv">
                                                                        <svg style={{ color: "#57606a" }} aria-label="File" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="fileSVG">
                                                                            <path fill="#57606a" fillRule="evenodd" d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z"></path>
                                                                        </svg>
                                                                        <p onClick={() => {
                                                                            window.location.href = data.link
                                                                        }}>{(usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath).split("/")[tempCounter_PRIVATE.current]}</p>
                                                                        <span style={{ margin: "0rem 0.5rem" }}>{(getProperDate(data.time))}</span>
                                                                        <>
                                                                            <div className="showMoreDiv">
                                                                                <details>
                                                                                    <summary>
                                                                                        <FiMoreVertical />
                                                                                    </summary>
                                                                                    <div className="showMoreOptionList">
                                                                                        <div onClick={() => shareFileLink(usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath, true)} className="shareFileOption showMoreOptions">Share</div>
                                                                                        <div onClick={() => changeFileVisibility(usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath, false)} className="changeVisibilityOption showMoreOptions">Public</div>
                                                                                        <div onClick={() => deleteFile(usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath, true)} className="deleteFile showMoreOptions">Delete</div>
                                                                                    </div>
                                                                                </details>
                                                                            </div>
                                                                        </>
                                                                    </div> : null
                                                                : shouldShowData === true ?
                                                                    <div key={i} className="fileShowerDiv">
                                                                        <svg style={{ color: "#54aeff" }} aria-label="Directory" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="folderSVG">
                                                                            <path fill="#54aeff" d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"></path>
                                                                        </svg>
                                                                        <p onClick={() => changeCurrentFolder((usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath).split("/")[tempCounter_PRIVATE.current], true)}>{(usersData_PRIVATE[tempCounter_PRIVATE.current].data[i].filePath).split("/")[tempCounter_PRIVATE.current]}</p>
                                                                    </div> : null
                                                        ))

                                                    }
                                                </div> : <></>
                                        }

                                        <div className="publicFileShower" style={{ marginTop: "5rem" }}>
                                            <div className="fileShowerHeading">
                                                <span className="circleShape" style={{ backgroundColor: "green" }}></span>
                                                <h1>Public</h1>
                                                <div className="pathShower">
                                                    {
                                                        usersData_PUBLIC[0].data.length > 0 ?
                                                            usersData_PUBLIC.map((data, i) => (
                                                                <span key={i} onClick={() => changeCurPath(i, false)}>{usersData_PUBLIC[i].path}</span>
                                                            )) : <><>No Files</></>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                usersData_PUBLIC[tempCounter_PUBLIC.current].data.map((data, i) => (
                                                    isFile(usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath, false) === true ?
                                                        shouldShowData === true ?
                                                            <div key={i} className="fileShowerDiv">
                                                                <svg style={{ color: "#57606a" }} aria-label="File" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="fileSVG">
                                                                    <path fill="#57606a" fillRule="evenodd" d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z"></path>
                                                                </svg>
                                                                <p onClick={() => {
                                                                    window.location.href = data.link
                                                                }}>{(usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath).split("/")[tempCounter_PUBLIC.current]}</p>
                                                                <span style={{ margin: "0rem 0.5rem" }}>{(getProperDate(data.time))}</span>
                                                                <div className="showMoreDiv">
                                                                    <details>
                                                                        <summary>
                                                                            <FiMoreVertical />
                                                                        </summary>
                                                                        <div className="showMoreOptionList">
                                                                            <div onClick={() => shareFileLink(usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath, false)} className="shareFileOption showMoreOptions">Share</div>
                                                                            {
                                                                                isMainUser === true ? <>
                                                                                    <div onClick={() => changeFileVisibility(usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath, true)} className="changeVisibilityOption showMoreOptions">Private</div>
                                                                                    <div onClick={() => deleteFile(usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath, false)} className="deleteFile showMoreOptions">Delete</div>
                                                                                </> : <></>
                                                                            }
                                                                        </div>
                                                                    </details>
                                                                </div>
                                                            </div> : null
                                                        : shouldShowData === true ?
                                                            <div key={i} className="fileShowerDiv">
                                                                <svg style={{ color: "#54aeff" }} aria-label="Directory" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="folderSVG">
                                                                    <path fill="#54aeff" d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"></path>
                                                                </svg>
                                                                <p onClick={() => changeCurrentFolder((usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath).split("/")[tempCounter_PUBLIC.current], false)}>{(usersData_PUBLIC[tempCounter_PUBLIC.current].data[i].filePath).split("/")[tempCounter_PUBLIC.current]}</p>
                                                            </div> : null
                                                ))

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
            }

        </>
    )
}
export default Dashboard; 