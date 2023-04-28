import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "../Firebase";
import { useEffect, useState } from "react";
import { BsXDiamond } from "react-icons/bs";

function Test() {
  const [file, setFile] = useState<File>();
  const [percentage, setPercentage] = useState<string>("");
  const [uploadStart, setUploadStart] = useState(false);

//   useEffect(() => {
//     if (percentage === "100")
//         setTimeout(() => {

//         }, 500)
//   }, [percentage])
  

  const upload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.log("File empty");
      return;
    }

    console.log(`${file.name} upload started`);
    setUploadStart(true);
    const name: string = file.name;
    const fileRef = ref(storage, `/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);//.then(() => console.log("Upload finished")).catch((err) => console.log(err));

    uploadTask.on("state_changed", (snapshot) => {
      const percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      const percentToShow = Number(percent).toFixed(2);
        console.log(snapshot.bytesTransferred, " / ", snapshot.totalBytes, " = ", (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setPercentage(percentToShow);
    //   if (percent >= 100)
    //     setPercentage(0);
    });
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0]);
  };

  return (
    <div>
      <form
        onSubmit={upload}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "250px",
        }}
      >
        <input type="file" onChange={change} />
        <button type="submit" style={{ width: "100px" }}>
          Upload
        </button>
      </form>
      {!uploadStart ? null : <p>{percentage}%</p>}
      {percentage === "100" ? <p>Upload finished</p> : null}
    </div>
  );
}

export default Test;
