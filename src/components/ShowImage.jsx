export default function ShowImage({ getFiles }) {
  return (
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
  );
}
