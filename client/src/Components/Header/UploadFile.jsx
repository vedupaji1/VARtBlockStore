import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { create as ipfsHttpClient } from 'ipfs-http-client' // This Line Of Code Is Taken From "https://github.com/dappuniversity/nft_marketplace/blob/main/src/frontend/components/Create.js", Basically Web3.Storage Was Not Working With ReactJs Because Of This We Are Using IPFS-Client.
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const UploadFile = () => {
    const dispatch = useDispatch();
    const fileUploadStatus = useSelector((state) => state.fileUploadStatus);

    const pushDataOnDatabase = (dataToSend) => {
        return new Promise(async (res, rej) => {
            let resData = await fetch("/storeFileData", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileData: dataToSend })
            })
            let data = await resData.json();
            if (data.isDone === true) {
                alert("Your File Is Uploaded");
            } else {
                alert(data.message);
            }
            window.location.reload();
            res(true);
        })
    }

    const storeData = async () => {
        try {
            if (document.getElementById("getFileInp").value !== "" && document.getElementById("getFileInp").value !== " ") {
                if (window.confirm("Are You Sure, Your File Will Store On IPFS") === true) {
                    dispatch({ type: "setIsLoading", payload: true });
                    let time = new Date();
                    let filePath = document.querySelector('input[type="file"]').files;
                    if (fileUploadStatus.isFolder === true) {
                        let dataToSend = [];
                        for (let i = 0; i < filePath.length; i++) {
                            const result = await client.add(filePath[0])
                            let mainData = "https://ipfs.io/ipfs/" + result.path;
                            console.log(mainData);
                            dataToSend.push({ filePath: filePath[i].webkitRelativePath, link: mainData, isPrivate: fileUploadStatus.isPrivate, time: time.getTime() })
                        }
                        await pushDataOnDatabase(dataToSend)
                    } else {
                        const result = await client.add(filePath[0])
                        let mainData = "https://ipfs.io/ipfs/" + result.path;
                        console.log(mainData);
                        await pushDataOnDatabase([{ filePath: filePath[0].name, link: mainData, isPrivate: fileUploadStatus.isPrivate, time: time.getTime() }])
                    }
                }
            } else {
                alert("Please Choose File");
            }
        } catch (error) {
            console.log(error)
            alert("Something Went Wrong");
            //window.location.reload();
        }
    }

    return (
        <>
            <div className="uploadImageMain">
                <div className="uploadImageSub">
                    <div className="closeUploadIcon">
                        <i onClick={() => {
                            dispatch({ type: "setIsFileUpload", payload: false })
                        }} className="fa fa-close" aria-hidden="true"></i>
                    </div>

                    <div className="uploadImageSubPart">
                        <h1 className="fileNameShower" style={{ paddingLeft: "2rem" }}> </h1>
                        <label htmlFor="getFileInp" className="getFile">Select <i className="fa fa-file-image-o" aria-hidden="true"></i></label>
                        {
                            fileUploadStatus.isFolder === true ?
                                <input onChange={(e) => {
                                    document.getElementsByClassName("fileNameShower")[0].innerText = document.querySelector('input[type="file"]').files.length + " Files"
                                }} type="file" style={{ visibility: "hidden" }} name="getFile" id="getFileInp" placeholder="Select" webkitdirectory="true" multiple />
                                : <input onChange={(e) => {
                                    document.getElementsByClassName("fileNameShower")[0].innerText = document.querySelector('input[type="file"]').files[0].name
                                }} type="file" style={{ visibility: "hidden" }} name="getFile" id="getFileInp" placeholder="Select" />
                        }


                        <div className="checkIsSetTopDataDiv">
                            <label htmlFor="isFolder">Upload Folder<i style={{
                                display: fileUploadStatus.isFolder === true ? "inline-block" : "none"
                            }} className="fa fa-check" id="checkBoxStatusShower" aria-hidden="true"></i></label>

                            <input onChange={(e) => {
                                document.getElementById("isFolder").checked === true ?
                                    dispatch({
                                        type: "setIsFolder", payload: {
                                            isFolder: true
                                        }
                                    }) :
                                    dispatch({
                                        type: "setIsFolder", payload: {
                                            isFolder: false
                                        }
                                    })
                            }} type="checkbox" id="isFolder" />
                        </div>

                        <div className="checkIsSetTopDataDiv">
                            <label htmlFor="isPrivate">Is Private<i style={{
                                display: fileUploadStatus.isPrivate === true ? "inline-block" : "none"
                            }} className="fa fa-check" id="checkBoxStatusShower" aria-hidden="true"></i></label>

                            <input onChange={(e) => {
                                document.getElementById("isPrivate").checked === true ?
                                    dispatch({
                                        type: "setIsPrivateFile", payload: {
                                            isPrivate: true
                                        }
                                    }) :
                                    dispatch({
                                        type: "setIsPrivateFile", payload: {
                                            isPrivate: false
                                        }
                                    })
                            }} type="checkbox" id="isPrivate" />
                        </div>

                        <button className="imageUploadSubmit" onClick={() => storeData()}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UploadFile;