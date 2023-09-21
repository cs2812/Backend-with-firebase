import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { FileDB } from "../Firebase";
import { useEffect, useState } from "react";
import "../styles.css";

export default function ImagesUpload() {
  const [files, setFiles] = useState("");
  const [getFiles, setGetFiles] = useState([]);
  const [toggle, setToggle] = useState(false);
  const uploadImage = () => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let Uid = files[i].name + Math.floor(Math.random() * 1000);
        uploadBytes(ref(FileDB, `images/${Uid}`), files[i])
          .then((res) => {
            console.log("Upload Successfully");
            // alert("Upload Successfully");
          })
          .catch((err) => {
            alert("Upload Failed");
            console.log(err);
          });
      }
    } else {
      alert("please select File");
    }
  };
  const getURL = async (item) => {
    let url = await getDownloadURL(item);
    return url;
  };
  const getImageData = async () => {
    let arr = [];
    let response = await listAll(ref(ref(FileDB, "images/")));
    arr = response.items.map(async (item) => {
      return await getURL(item);
    });
    let ImageData = await Promise.all(arr);
    setGetFiles(ImageData);
  };
  useEffect(() => {
    getImageData();
  }, [toggle]);
  return (
    <div>
      <div>
        <button onClick={() => setToggle(!toggle)}>Refresh</button>
      </div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          setFiles(e.target.files);
        }}
      />
      <button onClick={uploadImage}>Upload</button>
      <div style={{ marginTop: "20px" }}>
        {getFiles &&
          getFiles.map((ele, i) => {
            return (
              <div className="file" key={i}>
                <img src={ele} alt="img" />
              </div>
            );
          })}
      </div>
    </div>
  );
}
